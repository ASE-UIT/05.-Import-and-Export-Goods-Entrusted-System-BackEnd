import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateQuotationReqDto } from './dtos/CreateQuotationReqDto';
import { CreateQuotationReqStrategy } from './strategies/create-quotationReq/create-quotationReq.strategy';
import { FindQuotationReqStrategy } from './strategies/find-quotationReq/find-quotationReq-strategy.enum';
import { QuotationReq, QuotationReqStatus } from './models/quotationReq.model';
import { IFindQuotationReqStrategy } from './strategies/find-quotationReq/find-quotationReq-strategy.interface';
import { FindAllQuotationReqStrategy } from './strategies/find-quotationReq/find-all.strategy';
import { FindQuotationReqByRequestDateStrategy } from './strategies/find-quotationReq/find-by-requestDate.strategy';
import { FindQuotationReqByStatusStrategy } from './strategies/find-quotationReq/find-by-status.strategy';
import { UpdateQuotationReqStrategy } from './strategies/update-quotationReq/update-quotationReq.strategy';
import { ForeignKeyConstraintError } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { InjectModel } from '@nestjs/sequelize';
import { QuoteReqDetail } from '@/quote-request-details/models/quoteReqDetail.model';
import { PackageDetail } from '@/package-details/models/packageDetails.model';
import { CreateQuoteReqWithDetailDto } from './dtos/CreateQuoteReqWithDetail';
import { z } from 'zod';
import { UpdateQuoteReqWithDetailDto } from './dtos/UpdateQuotationReqWithDetail';
import { QueryQuotationReqDto } from './dtos/QueryQuotationReqDto';
import { PaginationDto } from '@/shared/dto/pagination.dto';
import { PaginatedResponse } from '@/shared/dto/paginated-response.dto';
import { PaginationResponse } from '@/shared/dto/paginantion-response.dto';
import { FindQuotationReqByUserIdStrategy } from './strategies/find-quotationReq/find-by-userId.strategy';
import { User } from '@/users/models/user.model';
import { Role } from '@/roles/models/role.model';
import { RoleEnum } from '@/shared/enums/roles.enum';

@Injectable()
export class QuotationReqsService {
  constructor(
    private createQuotationReqStrategy: CreateQuotationReqStrategy,
    private updateQuotationReqStrategy: UpdateQuotationReqStrategy,
    private findAllQuotationReqStratygy: FindAllQuotationReqStrategy,
    private findQuotationReqByRequestDateStrategy: FindQuotationReqByRequestDateStrategy,
    private findQuotationReqByStatus: FindQuotationReqByStatusStrategy,
    private findQuotationReqByUserId: FindQuotationReqByUserIdStrategy,
    private sequelize: Sequelize,
    @InjectModel(QuotationReq) private quotationReqModel: typeof QuotationReq,
    @InjectModel(QuoteReqDetail)
    private quoteReqDetailModel: typeof QuoteReqDetail,
    @InjectModel(PackageDetail)
    private packageDetailModel: typeof PackageDetail,
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Role) private roleModel: typeof Role,
  ) {}

  async getQuoteRequests(
    quoteRequestInfo: QueryQuotationReqDto,
    //pagination: Partial<PaginationDto>,
  ): Promise<QuotationReq[]> {
    //Promise<PaginatedResponse<QuotationReq>>
    // const { page = 1, limit = 10 } = pagination;
    // const offset = (page - 1) * limit;

    const count = await this.quotationReqModel.count({
      where: quoteRequestInfo,
      distinct: true,
    });

    const rows: QuotationReq[] = await this.quotationReqModel.findAll({
      where: quoteRequestInfo,
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

    // const response: PaginatedResponse<QuotationReq> = {
    //   pagination: paginationInfo,
    //   results: rows,
    // };
    return rows;
  }

  async getQuoteRequestWithDetailsById(id: string) {
    const quoteRequest = await this.quotationReqModel.findByPk(id, {
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
    });

    if (!quoteRequest) {
      throw new NotFoundException(
        'Quote request id does not exists in database',
      );
    }

    return quoteRequest;
  }

  async createQuoteRequestWithDetails(data: CreateQuoteReqWithDetailDto) {
    const user = await this.userModel.findByPk(data.userId, {
      include: [
        {
          model: this.roleModel,
        },
      ],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (
      !user.role ||
      (user.role.name !== RoleEnum.CLIENT && user.role.name !== RoleEnum.ADMIN)
    ) {
      throw new ForbiddenException(
        'Access denied: Only CLIENT role is allowed in userId feild',
      );
    }
    console.log('Check user', user);
    const transaction = await this.sequelize.transaction();

    try {
      const quoteRequest = await this.quotationReqModel.create(
        {
          requestDate: data.requestDate,
          status: QuotationReqStatus.PENDING,
          userId: data.userId,
        },
        { transaction },
      );

      const quoteRequestDetail = await this.quoteReqDetailModel.create(
        {
          origin: data.origin,
          destination: data.destination,
          shipmentReadyDate: data.shipmentReadyDate,
          shipmentDeadline: data.shipmentDeadline,
          cargoInsurance: data.cargoInsurance,
          shipmentType: data.shipmentType,
          quoteReqId: quoteRequest.id,
        },
        { transaction },
      );

      const packageDetail = await this.packageDetailModel.create(
        {
          packageType: data.packageType,
          weight: data.weight,
          length: data.length,
          width: data.width,
          height: data.height,
          detailId: quoteRequestDetail.id,
        },
        { transaction },
      );

      await transaction.commit();
      return { quoteRequest, quoteRequestDetail, packageDetail };
      // return {
      //   quoteRequest: {
      //     ...quoteRequest.toJSON(), // Chuyển đổi đối tượng Sequelize thành JSON nếu cần
      //     quoteRequestDetail: {
      //       ...quoteRequestDetail.toJSON(),
      //       packageDetail: packageDetail.toJSON()
      //     }
      //   }
      // }
    } catch (error) {
      await transaction.rollback();
      console.log('Check error', error);
      if (
        error instanceof ForeignKeyConstraintError ||
        error instanceof NotFoundException
      ) {
        throw new HttpException('Customer not found.', HttpStatus.BAD_REQUEST);
      }
      if (error instanceof z.ZodError) {
        throw new HttpException(error.errors, HttpStatus.BAD_REQUEST);
      }
      if (error instanceof UnauthorizedException) {
        throw new HttpException(error.message, HttpStatus.FORBIDDEN);
      }
      throw new HttpException(
        'Error when creating quote request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateQuoteRequestWithDetails(
    id: string,
    data: UpdateQuoteReqWithDetailDto,
  ) {
    const transaction = await this.sequelize.transaction();

    try {
      const quoteRequest = await this.quotationReqModel.findByPk(id, {
        transaction,
      });
      if (!quoteRequest) {
        throw new NotFoundException('Quote Request not found.');
      }

      await quoteRequest.update(
        {
          requestDate: data.requestDate,
          status: data.status,
        },
        { transaction },
      );

      const quoteRequestDetail = await this.quoteReqDetailModel.findOne({
        where: { quoteReqId: quoteRequest.id },
        transaction,
      });

      if (!quoteRequestDetail) {
        throw new NotFoundException('Quote Request Detail not found.');
      }

      await quoteRequestDetail.update(
        {
          origin: data.origin,
          destination: data.destination,
          shipmentReadyDate: data.shipmentReadyDate,
          shipmentDeadline: data.shipmentDeadline,
          cargoInsurance: data.cargoInsurance,
          shipmentType: data.shipmentType,
        },
        { transaction },
      );

      const packageDetail = await this.packageDetailModel.findOne({
        where: { detailId: quoteRequestDetail.id },
        transaction,
      });

      if (!packageDetail) {
        throw new NotFoundException('Package Detail not found.');
      }

      await packageDetail.update(
        {
          packageType: data.packageType,
          weight: data.weight,
          length: data.length,
          width: data.width,
          height: data.height,
        },
        { transaction },
      );

      await transaction.commit();

      return { quoteRequest, quoteRequestDetail, packageDetail };
    } catch (error) {
      await transaction.rollback();
      console.log('Check error', error);
      if (error instanceof ForeignKeyConstraintError) {
        throw new HttpException('Customer not found.', HttpStatus.BAD_REQUEST);
      }
      if (error instanceof z.ZodError) {
        throw new HttpException(error.errors, HttpStatus.BAD_REQUEST);
      }
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Error when updating quote request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // finding services
  async findQuotationReq(
    strategy: FindQuotationReqStrategy,
    quotationReqInfo: string,
  ): Promise<QuotationReq[] | null> {
    const findStrategy = this.getFindStrategy(strategy);
    const quotationReq: QuotationReq[] | null =
      await findStrategy.find(quotationReqInfo);
    return quotationReq;
  }

  getFindStrategy(
    strategy: FindQuotationReqStrategy,
  ): IFindQuotationReqStrategy {
    switch (strategy) {
      case FindQuotationReqStrategy.ALL:
        return this.findAllQuotationReqStratygy;
      case FindQuotationReqStrategy.REQUESTDATE:
        return this.findQuotationReqByRequestDateStrategy;
      case FindQuotationReqStrategy.STATUS:
        return this.findQuotationReqByStatus;
      case FindQuotationReqStrategy.USERID:
        return this.findQuotationReqByUserId;
    }
  }

  async createQuotationReq(
    quotationReqInfo: CreateQuotationReqDto,
  ): Promise<QuotationReq> {
    try {
      return await this.createQuotationReqStrategy.create(quotationReqInfo);
    } catch (error) {
      //throw new BadRequestException('Error when create quotation request:' + error.message)
      if (error instanceof ForeignKeyConstraintError) {
        throw new HttpException('Invalid foreign key.', HttpStatus.BAD_REQUEST);
      }
      throw new Error();
    }
  }

  async updateQuotationReq(
    id: string,
    quotationReqInfo: Partial<CreateQuotationReqDto>,
  ): Promise<{
    message: string;
    data: QuotationReq;
  }> {
    const updatedResponse = await this.updateQuotationReqStrategy.update(
      id,
      quotationReqInfo,
    );

    try {
      return {
        message: 'Quote Request updated successfully',
        data: updatedResponse,
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
      throw new Error();
    }
  }
}
