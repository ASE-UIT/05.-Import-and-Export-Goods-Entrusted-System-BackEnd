import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Quotation } from './models/quotations.model';
import { CreateQuotationDto } from './dtos/CreateQuotationDto';
import { ForeignKeyConstraintError, Op } from 'sequelize';
import { QueryQuotationDto } from './dtos/QueryQuotationDto';
import { InjectModel } from '@nestjs/sequelize';
import { QuotationStatus } from '@/shared/enums/quotation-status.enum';
import { QuotationReq } from '@/quotation-requests/models/quotationReq.model';
import { UpdateQuotationDto } from './dtos/UpdateQuotationDto';
import { Sequelize } from 'sequelize-typescript';
import { QuotationService } from '@/quotation-services/models/quotation-services.model';
import { Service } from '@/services/models/service.model';
import {
  QuoteReqDetail,
  ShipmentType,
} from '@/quote-request-details/models/quoteReqDetail.model';
import {
  PackageDetail,
  PackageType,
} from '@/package-details/models/packageDetails.model';
import { Freight } from '@/freights/models/freights.model';
import { AirFreight } from '@/air-freights/models/air-freights.model';
import { LandFreight } from '@/land-freights/models/land-freights.model';
import { FCL } from '@/fcls/models/fcls.model';
import { LCL } from '@/lcls/models/lcls.model';

type Container = {
  name: string;
  price: number;
  maxWeight: number;
};

@Injectable()
export class QuotationsService {
  constructor(
    @InjectModel(Quotation)
    private quotationModel: typeof Quotation,
    @InjectModel(QuotationReq)
    private quoteReqModel: typeof QuotationReq,
    @InjectModel(QuoteReqDetail)
    private quoteReqDetailModel: typeof QuoteReqDetail,
    @InjectModel(PackageDetail)
    private packageDetailModel: typeof PackageDetail,
    @InjectModel(QuotationService)
    private quotationServiceModel: typeof QuotationService,
    @InjectModel(Service)
    private serviceModel: typeof Service,
    @InjectModel(Freight)
    private freightModel: typeof Freight,
    @InjectModel(AirFreight)
    private airFreightModel: typeof AirFreight,
    @InjectModel(LandFreight)
    private landFreightModel: typeof LandFreight,
    @InjectModel(FCL)
    private fclModel: typeof FCL,
    @InjectModel(LCL)
    private lclModel: typeof LCL,
    private sequelize: Sequelize,
  ) {}

  async create(quotationInfo: CreateQuotationDto) {
    const transaction = await this.sequelize.transaction();
    try {
      //return await this.createQuotationStrategy.create(quotationInfo);
      const quoteReq = await this.quoteReqModel.findByPk(
        quotationInfo.quoteReqId,
        {
          include: [
            {
              model: this.quoteReqDetailModel,
              include: [
                {
                  model: this.packageDetailModel,
                },
              ],
            },
          ],
          raw: true,
          nest: true,
        },
      );
      if (!quoteReq) {
        throw new NotFoundException('Quotation request not found');
      }
      const freight = await this.freightModel.findByPk(
        quotationInfo.freightId,
        {
          include: [
            {
              model: this.airFreightModel,
            },
            {
              model: this.landFreightModel,
            },
            {
              model: this.fclModel,
            },
            {
              model: this.lclModel,
            },
          ],
          raw: true,
          nest: true,
        },
      );
      if (!freight) throw new NotFoundException('Freight not found');
      if (
        (freight.freightType as unknown as ShipmentType) !==
        quoteReq.quoteReqDetails.shipmentType
      ) {
        throw new BadRequestException(
          `Freight type: ${freight.freightType} is not match with shipment type: ${quoteReq.quoteReqDetails.shipmentType}`,
        );
      }

      let totalServicePrice = 0;
      const freightPrice = await this.calculateFreightPrice(quoteReq, freight);

      if (quotationInfo.serviceIds && quotationInfo.serviceIds.length > 0) {
        const services = await this.serviceModel.findAll({
          where: { id: quotationInfo.serviceIds },
          attributes: ['id', 'fee'],
          transaction,
        });

        const validServiceIds = services.map((service) => service.id);
        const invalidServiceIds = quotationInfo.serviceIds.filter(
          (serviceId) => !validServiceIds.includes(serviceId),
        );

        if (invalidServiceIds.length > 0) {
          throw new NotFoundException(
            `Invalid service ids: ${invalidServiceIds.join(', ')}`,
          );
        }

        totalServicePrice = services.reduce(
          (sum, service) => sum + service.fee,
          0,
        );

        const quotation = await this.quotationModel.create(
          {
            totalPrice: totalServicePrice + freightPrice,
            pickupDate: quotationInfo.pickupDate,
            deliveryDate: quotationInfo.deliveryDate,
            quotationDate: quotationInfo.quotationDate,
            expiredDate: quotationInfo.expiredDate,
            status: QuotationStatus.DRAFT,
            freightId: quotationInfo.freightId,
            quoteReqId: quotationInfo.quoteReqId,
            employeeId: quotationInfo.employeeId,
            userId: quoteReq.userId,
          },
          { transaction },
        );

        const quotationServices = quotationInfo.serviceIds.map((serviceId) => ({
          quotation_id: quotation.id,
          service_id: serviceId,
        }));

        await this.quotationServiceModel.bulkCreate(quotationServices, {
          transaction,
        });

        await transaction.commit();
        return {
          ...quotation.toJSON(),
          servideIds: quotationInfo.serviceIds,
        };
      } else {
        // console.log('TOtal freight:', freightPrice);
        // console.log('Total service:', totalServicePrice);
        const quotation = await this.quotationModel.create(
          {
            totalPrice: totalServicePrice + freightPrice,
            pickupDate: quotationInfo.pickupDate,
            deliveryDate: quotationInfo.deliveryDate,
            quotationDate: quotationInfo.quotationDate,
            expiredDate: quotationInfo.expiredDate,
            status: QuotationStatus.DRAFT,
            freightId: quotationInfo.freightId,
            quoteReqId: quotationInfo.quoteReqId,
            employeeId: quotationInfo.employeeId,
            userId: quoteReq.userId,
          },
          { transaction },
        );

        await transaction.commit();
        return {
          ...quotation.toJSON(),
          servideIds: [],
        };
      }
    } catch (error) {
      await transaction.rollback();
      if (error instanceof ForeignKeyConstraintError) {
        throw new HttpException(
          `Invalid foreign key: ${error.message}`,
          HttpStatus.BAD_REQUEST,
        );
      }
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      if (error instanceof BadRequestException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new Error(error);
    }
  }

  calculateFreightPrice(quoteReq, freight) {
    let freightCost = 0;

    //const weight = quoteReq.quoteReqDetails.packageDetails.weight;
    const { length, width, height, weight } =
      quoteReq.quoteReqDetails.packageDetails;
    const volume = length * width * height;
    switch (quoteReq.quoteReqDetails.shipmentType) {
      case ShipmentType.AIR:
        // console.log('check go air');
        if (!freight.airFreight.air_freight_id)
          throw new NotFoundException('Air price not found');
        if (weight >= 0 && weight < 45) {
          freightCost = weight * freight.airFreight.price_0K;
        } else if (weight >= 45 && weight <= 100) {
          freightCost = weight * freight.airFreight.price_45K;
        } else if (weight > 100 && weight <= 300) {
          freightCost = weight * freight.airFreight.price_100K;
        } else if (weight > 300 && weight <= 500) {
          freightCost = weight * freight.airFreight.price_300K;
        } else if (weight > 500) {
          freightCost = weight * freight.airFreight.price_500K;
        } else {
          throw new BadRequestException('Package weight is invalid');
        }
        break;
      case ShipmentType.LAND:
        // console.log('check go land');

        if (!freight.landFreight.land_freight_id)
          throw new NotFoundException('Land price not found');
        if (weight >= 0 && weight < 100) {
          freightCost = weight * freight.landFreight.price_0_100;
        } else if (weight >= 100 && weight < 200) {
          freightCost = weight * freight.landFreight.price_100_200;
        } else if (weight >= 200 && weight < 500) {
          freightCost = weight * freight.landFreight.price_200_500;
        } else if (weight >= 500 && weight < 1500) {
          freightCost = weight * freight.landFreight.price_500_1500;
        } else if (weight >= 1500 && weight < 5000) {
          freightCost = weight * freight.landFreight.price_1500_5000;
        } else if (weight >= 5000 && weight < 10000) {
          freightCost = weight * freight.landFreight.price_5000_10000;
        } else if (weight >= 10000) {
          freightCost = weight * freight.landFreight.price_10000;
        } else {
          throw new BadRequestException('Package weight is invalid');
        }
        break;
      case ShipmentType.FCL:
        if (!freight.fcl.fcl_id)
          throw new NotFoundException('FCL price not found');
        if (
          quoteReq.quoteReqDetails.packageDetails.packageType ===
          PackageType.DRY
        ) {
          // console.log('Weight: ', weight);
          const containers: Container[] = [
            { name: '20DC', price: freight.fcl.price_20dc, maxWeight: 28280 },
            { name: '40DC', price: freight.fcl.price_40dc, maxWeight: 26750 },
            { name: '40HC', price: freight.fcl.price_40hc, maxWeight: 26580 },
          ];
          freightCost = this.getOptimalShippingCost(weight, containers);
        } else {
          const containers: Container[] = [
            { name: '20RF', price: freight.fcl.price_20rf, maxWeight: 27280 },
            { name: '40RF', price: freight.fcl.price_40rf, maxWeight: 28390 },
          ];
          freightCost = this.getOptimalShippingCost(weight, containers);
        }
        break;
      case ShipmentType.LCL:
        if (!freight.lcl.lcl_id)
          throw new NotFoundException('LCL price not found');
        freightCost = Math.max(volume, weight / 1000) * freight.lcl.cost;
        // console.log('Volume:', volume);
        // console.log('Weight:', weight);
        // console.log('Freight cost:', freightCost);
        break;
    }
    // console.log('Freight cost:', freightCost);
    // console.log('Addition fee:', freight.additionFee);
    return freightCost + freight.additionFee;
  }

  getOptimalShippingCost(weight: number, containers: Container[]): number {
    let optimalCost = Infinity;

    for (let container of containers) {
      if (weight <= container.maxWeight) {
        const cost = container.price;
        if (cost < optimalCost) {
          optimalCost = cost;
        }
      } else {
        const requiredContainers = Math.ceil(weight / container.maxWeight);
        const totalCost = requiredContainers * container.price;
        if (totalCost < optimalCost) {
          optimalCost = totalCost;
        }
      }
    }

    return optimalCost;
  }

  async findQuotations(
    quotationInfo: QueryQuotationDto,
    // pagination: Partial<PaginationDto>,
  ): Promise<Quotation[]> {
    //Promise<PaginatedResponse<Quotation>>
    // const { page = 1, limit = 10 } = pagination;
    // const offset = (page - 1) * limit;

    const whereCondition: any = { ...quotationInfo };

    // if (quotationInfo.userId) {
    //   whereCondition.quoteReqId = {
    //     [Op.in]: Sequelize.literal(`(
    //   SELECT "id"
    //   FROM "quotation_reqs"
    //   WHERE "userId" = '${quotationInfo.userId}'
    // )`),
    //   };

    //   delete whereCondition.userId;
    // }

    // const count = await this.quotationModel.count({
    //   where: whereCondition,
    //   distinct: true,
    // });

    const rows: Quotation[] = await this.quotationModel.findAll({
      where: whereCondition,
      // offset,
      // limit,
      subQuery: true,
    });

    // const paginationInfo: PaginationResponse = {
    //   currentPage: page && limit ? page : null,
    //   records: count,
    //   totalPages: page && limit ? Math.ceil(count / limit) : null,
    //   nextPage: page * limit < count ? page + 1 : null,
    //   prevPage: (page - 1) * limit > 0 ? page - 1 : null,
    // };

    // const response: PaginatedResponse<Quotation> = {
    //   pagination: paginationInfo,
    //   results: rows,
    // };

    const quotationsWithServiceIds = await Promise.all(
      rows.map(async (quotation) => {
        // Lấy các serviceId liên quan đến quotation này
        const services = await this.quotationServiceModel.findAll({
          where: { quotation_id: quotation.id },
          attributes: ['service_id'],
        });

        // Lấy danh sách các serviceIds
        const serviceIds = services.map((service) => service.service_id);

        // Trả về quotation kèm theo serviceIds
        return {
          ...quotation.toJSON(), // Lấy tất cả thông tin của quotation
          serviceIds, // Thêm serviceIds vào kết quả trả về
        };
      }),
    );
    return quotationsWithServiceIds;
  }

  async findQuotationById(id: string) {
    const quotation = await this.quotationModel.findOne({ where: { id } });
    if (!quotation) throw new NotFoundException('Quotation not found');
    const serviceRecords = await this.quotationServiceModel.findAll({
      where: { quotation_id: quotation.id },
      attributes: ['service_id'],
    });

    const serviceIds = serviceRecords.map((record) => record.service_id);
    return {
      ...quotation.toJSON(),
      serviceIds,
    };
  }

  async update(
    quotationID: string,
    updateInfo: UpdateQuotationDto,
  ): Promise<Quotation> {
    if (Object.keys(updateInfo).length < 1) {
      throw new BadRequestException('Body is empty');
    }
    try {
      const currentQuotation = await this.quotationModel.findByPk(quotationID);
      if (!currentQuotation) {
        throw new NotFoundException('Quotation does not exist in database');
      }

      const { quotationDate, pickupDate, deliveryDate, expiredDate } = {
        ...currentQuotation.dataValues,
        ...updateInfo, // merge existing and updated values
      };

      if (
        (quotationDate && pickupDate && quotationDate > pickupDate) ||
        (pickupDate && deliveryDate && pickupDate > deliveryDate) ||
        (deliveryDate && expiredDate && deliveryDate > expiredDate)
      ) {
        throw new BadRequestException(
          'Dates must be in the following order: quotationDate <= pickupDate <= deliveryDate <= expiredDate',
        );
      }

      const [affetedRows, [updateData]] = await this.quotationModel.update(
        { ...updateInfo },
        { where: { id: quotationID }, returning: true },
      );

      const serviceRecords = await this.quotationServiceModel.findAll({
        where: { quotation_id: quotationID },
        attributes: ['service_id'],
      });

      const serviceIds = serviceRecords.map((record) => record.service_id);

      return {
        ...updateData.dataValues,
        serviceIds,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          'Quotation does not exist in database',
          HttpStatus.NOT_FOUND,
        );
      }
      if (error instanceof ForeignKeyConstraintError) {
        throw new HttpException('Invalid foreign key', HttpStatus.BAD_REQUEST);
      }
      if (error instanceof BadRequestException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new Error();
    }
  }
}
