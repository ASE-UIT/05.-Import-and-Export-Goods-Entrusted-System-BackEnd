import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Quotation } from './models/quotations.model';
import { CreateQuotationDto } from './dtos/CreateQuotationDto';
import { FindQuotationByStatus } from './strategies/find-quotation/find-by-status';
import { FindQuotationByDeliveryDate } from './strategies/find-quotation/find-by-delivery-date';
import { FindQuotationByExpiredDate } from './strategies/find-quotation/find-by-expired-date';
import { FindQuotationByPickupDate } from './strategies/find-quotation/find-by-pickup-date';
import { FindQuotationByQuotationDate } from './strategies/find-quotation/find-by-quotation-date';
import { FindQuotationByTotalPrice } from './strategies/find-quotation/find-by-total-price';
import { FindAllQuotationStrategy } from './strategies/find-quotation/find-all.strategy';
import { FindQuotationStrategy } from './strategies/find-quotation/find-quotation-strategy.enum';
import { IFindQuotationStrategy } from './strategies/find-quotation/find-quotation-strategy.interface';
import { CreateQuotationStrategy } from './strategies/create-quotation/create-quotation.strategy';
import { UpdateQuotationStrategy } from './strategies/update-quotation/update-quotation.strategy';
import { FindQuotationByEmployeeId } from './strategies/find-quotation/find-by-employee-id';
import { FindQuotationByCustomerId } from './strategies/find-quotation/find-by-customer-id';
import { ForeignKeyConstraintError, Op } from 'sequelize';
import { QueryQuotationDto } from './dtos/QueryQuotationDto';
import { PaginationDto } from '@/shared/dto/pagination.dto';
import { PaginationResponse } from '@/shared/dto/paginantion-response.dto';
import { PaginatedResponse } from '@/shared/dto/paginated-response.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class QuotationsService {
  constructor(
    @InjectModel(Quotation)
    private quotationModel: typeof Quotation,
    private findAllQuotationStrategy: FindAllQuotationStrategy,
    private findQuotationByPickupDate: FindQuotationByPickupDate,
    private findQuotationByStatus: FindQuotationByStatus,
    private findQuotationByDeliveryDate: FindQuotationByDeliveryDate,
    private findQuotationByExpiredDate: FindQuotationByExpiredDate,
    private findQuotationByQuotationDate: FindQuotationByQuotationDate,
    private findQuotationByTotalPrice: FindQuotationByTotalPrice,
    private findQuotationByEmployeeId: FindQuotationByEmployeeId,
    private findQuotationByCustomerId: FindQuotationByCustomerId,
    private createQuotationStrategy: CreateQuotationStrategy,
    private updateQuotationStrategy: UpdateQuotationStrategy,
  ) {}

  async create(quotationInfo: CreateQuotationDto): Promise<Quotation> {
    try {
      return await this.createQuotationStrategy.create(quotationInfo);
    } catch (error) {
      // if (error instanceof ForeignKeyConstraintError) {
      //   throw new HttpException('Invalid foreign key.', HttpStatus.BAD_REQUEST);
      // }
      if (error instanceof NotFoundException) {
        throw new HttpException('Invalid foreign key.', HttpStatus.BAD_REQUEST);
      }
      throw new Error(error);
    }
  }

  async findQuotations(
    quotationInfo: QueryQuotationDto,
    pagination: Partial<PaginationDto>,
  ): Promise<PaginatedResponse<Quotation>> {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;

    const whereCondition: any = { ...quotationInfo };

    if (quotationInfo.customerId) {
      whereCondition.quoteReqId = {
        [Op.in]: Sequelize.literal(`(
      SELECT "id" 
      FROM "quotation_reqs" 
      WHERE "customerId" = '${quotationInfo.customerId}'
    )`),
      };

      delete whereCondition.customerId;
    }

    const count = await this.quotationModel.count({
      where: whereCondition,
      distinct: true,
    });

    const rows: Quotation[] = await this.quotationModel.findAll({
      where: whereCondition,
      offset,
      limit,
      subQuery: true,
    });

    const paginationInfo: PaginationResponse = {
      currentPage: page && limit ? page : null,
      records: count,
      totalPages: page && limit ? Math.ceil(count / limit) : null,
      nextPage: page * limit < count ? page + 1 : null,
      prevPage: (page - 1) * limit > 0 ? page - 1 : null,
    };

    const response: PaginatedResponse<Quotation> = {
      pagination: paginationInfo,
      results: rows,
    };
    return response;
  }

  async findQuotationById(id: string): Promise<Quotation> {
    const quotation = await this.quotationModel.findOne({ where: { id } });
    if (!quotation) throw new NotFoundException('Quotation not found');
    return quotation;
  }

  // async find(
  //   strategy: FindQuotationStrategy,
  //   quotationInfo: any,
  // ): Promise<Quotation[] | null> {
  //   const findStrategy = this.getFindStrategy(strategy);
  //   const quotation: Quotation[] | null =
  //     await findStrategy.find(quotationInfo);
  //   return quotation;
  // }

  // getFindStrategy(strategy: FindQuotationStrategy): IFindQuotationStrategy {
  //   switch (strategy) {
  //     case FindQuotationStrategy.ALL:
  //       return this.findAllQuotationStrategy;
  //     case FindQuotationStrategy.DELIVERY_DATE:
  //       return this.findQuotationByDeliveryDate;
  //     case FindQuotationStrategy.EXPIRED_DATE:
  //       return this.findQuotationByExpiredDate;
  //     case FindQuotationStrategy.PICKUP_DATE:
  //       return this.findQuotationByPickupDate;
  //     case FindQuotationStrategy.QUOTATION_DATE:
  //       return this.findQuotationByQuotationDate;
  //     case FindQuotationStrategy.STATUS:
  //       return this.findQuotationByStatus;
  //     case FindQuotationStrategy.TOTAL_PRICE:
  //       return this.findQuotationByTotalPrice;
  //     case FindQuotationStrategy.EMPLOYEE_ID:
  //       return this.findQuotationByEmployeeId;
  //     case FindQuotationStrategy.CUSTOMER_ID:
  //       return this.findQuotationByCustomerId;
  //   }
  // }

  async update(
    quotationID: string,
    updateInfo: Partial<CreateQuotationDto>,
  ): Promise<Quotation> {
    if (Object.keys(updateInfo).length < 1) {
      throw new BadRequestException('Body is empty');
    }
    try {
      return await this.updateQuotationStrategy.update(quotationID, updateInfo);
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
      throw new Error();
    }
  }
}
