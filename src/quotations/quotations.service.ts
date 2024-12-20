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

@Injectable()
export class QuotationsService {
  constructor(
    @InjectModel(Quotation)
    private quotationModel: typeof Quotation,
    @InjectModel(QuotationReq)
    private quoteReqModel: typeof QuotationReq,
    @InjectModel(QuotationService)
    private quotationServiceModel: typeof QuotationService,
    @InjectModel(Service)
    private serviceModel: typeof Service,
    private sequelize: Sequelize,
    // private findAllQuotationStrategy: FindAllQuotationStrategy,
    // private findQuotationByPickupDate: FindQuotationByPickupDate,
    // private findQuotationByStatus: FindQuotationByStatus,
    // private findQuotationByDeliveryDate: FindQuotationByDeliveryDate,
    // private findQuotationByExpiredDate: FindQuotationByExpiredDate,
    // private findQuotationByQuotationDate: FindQuotationByQuotationDate,
    // private findQuotationByTotalPrice: FindQuotationByTotalPrice,
    // private findQuotationByEmployeeId: FindQuotationByEmployeeId,
    // private findQuotationByUserId: FindQuotationByUserId,
    // private createQuotationStrategy: CreateQuotationStrategy,
    // private updateQuotationStrategy: UpdateQuotationStrategy,
  ) {}

  async create(quotationInfo: CreateQuotationDto) {
    const transaction = await this.sequelize.transaction();
    try {
      //return await this.createQuotationStrategy.create(quotationInfo);
      const quoteReq = await this.quoteReqModel.findByPk(
        quotationInfo.quoteReqId,
      );
      if (!quoteReq) {
        throw new NotFoundException('Quotation request not found');
      }

      let totalServicePrice = 0;

      if (quotationInfo.serviceIds && quotationInfo.serviceIds.length > 0) {
        const services = await this.serviceModel.findAll({
          where: { id: quotationInfo.serviceIds },
          attributes: ['id', 'fee'], // Lấy thêm thuộc tính `fee`
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
            totalPrice: totalServicePrice,
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
        const quotation = await this.quotationModel.create(
          {
            totalPrice: totalServicePrice,
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
      throw new Error(error);
    }
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

  async findQuotationById(id: string): Promise<Quotation> {
    const quotation = await this.quotationModel.findOne({ where: { id } });
    if (!quotation) throw new NotFoundException('Quotation not found');
    return quotation;
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
      return updateData.dataValues as Quotation;
      //return await this.updateQuotationStrategy.update(quotationID, updateInfo);
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
