import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateQuoteReqDetailDto } from './dtos/CreateQuoteReqDetailDto';
import { CreateQuoteReqDetailStrategy } from './strategies/create-quoteReqDetail/create-quoteReqDetail.strategy';
import { UpdateQuoteReqDetailStrategy } from './strategies/update-quoteReqDetail/update-quoteReqDetail.strategy';
import { FindQuoteReqDetailStrategy } from './strategies/find_quoteReqDetail/find-quoteReqDetail-strategy.enum';
import { QuoteReqDetail, ShipmentType } from './models/quoteReqDetail.model';
import { IFindQuoteReqDetailStrategy } from './strategies/find_quoteReqDetail/find-quoteReqDetail-strategy.interface';
import { FindAllQuotationReqStrategy } from '@/quotation-requests/strategies/find-quotationReq/find-all.strategy';
import { FindQuoteReqDetailByOriginStrategy } from './strategies/find_quoteReqDetail/find-by-origin.strategy';
import { FindQuoteReqDetailByDestinationStrategy } from './strategies/find_quoteReqDetail/find-by-destination.strategy';
import { FindQuoteReqDetailByShipmentReadyDateStrategy } from './strategies/find_quoteReqDetail/find-by-shipmentReadyDate.strategy';
import { FindQuoteReqDetailByShipmentDeadlineStrategy } from './strategies/find_quoteReqDetail/find-by-shipmentDeadline.strategy';
import { FindQuoteReqDetailByCargoInsuranceStrategy } from './strategies/find_quoteReqDetail/find-by-cargoInsurance.strategy';
import { FindQuoteReqDetailByQuoteReqIdStrategy } from './strategies/find_quoteReqDetail/find-by-quoteReqId.strategy';
import { FindAllQuoteReqDetailStrategy } from './strategies/find_quoteReqDetail/find-all.strategy';
import {
  BaseError,
  ForeignKeyConstraintError,
  HostNotFoundError,
} from 'sequelize';
import { QueryQuoteReqDetailDto } from './dtos/QueryQuoteReqDetailDto';
import { InjectModel } from '@nestjs/sequelize';
import { z } from 'zod';
import { UpdateQuoteReqWithDetailDto } from '@/quotation-requests/dtos/UpdateQuotationReqWithDetail';

@Injectable()
export class QuoteReqDetailsService {
  constructor(
    @InjectModel(QuoteReqDetail)
    private quoteReqDetail: typeof QuoteReqDetail,
    private createQuoteReqDetailStrategy: CreateQuoteReqDetailStrategy,
    private updateQuoteReqDetailStrategy: UpdateQuoteReqDetailStrategy,
    private findAllQuoteReqDetailStrategy: FindAllQuoteReqDetailStrategy,
    private findQuoteReqDetailByOrigin: FindQuoteReqDetailByOriginStrategy,
    private findQuoteReqDetailByDestination: FindQuoteReqDetailByDestinationStrategy,
    private findQuoteReqDetailByShipmentReadyDate: FindQuoteReqDetailByShipmentReadyDateStrategy,
    private findQuoteReqDetailByShipmentDeadline: FindQuoteReqDetailByShipmentDeadlineStrategy,
    private findQuoteReqDetailByCargoInsurance: FindQuoteReqDetailByCargoInsuranceStrategy,
    private findQuoteReqDetailByQuoteReqId: FindQuoteReqDetailByQuoteReqIdStrategy,
  ) {}

  async findQuoteReqDetail(
    //strategy: FindQuoteReqDetailStrategy,
    quoteReqDetailInfo: QueryQuoteReqDetailDto,
  ): Promise<QuoteReqDetail[]> {
    const rows: QuoteReqDetail[] = await this.quoteReqDetail.findAll({
      where: quoteReqDetailInfo,
      // offset,
      // limit,
      subQuery: true,
    });
    return rows;
  }

  async findQuoteReqDetailById(id: string): Promise<QuoteReqDetail> {
    const quoteReqDetail = await this.quoteReqDetail.findByPk(id);
    if (!quoteReqDetail) {
      throw new NotFoundException("Quote request detail id doesn't exist");
    }
    return quoteReqDetail;
  }

  //   getFindStrategy(
  //     strategy: FindQuoteReqDetailStrategy,
  //   ): IFindQuoteReqDetailStrategy {
  //     switch (strategy) {
  //       case FindQuoteReqDetailStrategy.ALL:
  //         return this.findAllQuoteReqDetailStrategy;
  //       case FindQuoteReqDetailStrategy.ORIGIN:
  //         return this.findQuoteReqDetailByOrigin;
  //       case FindQuoteReqDetailStrategy.DESTINATION:
  //         return this.findQuoteReqDetailByDestination;
  //       case FindQuoteReqDetailStrategy.SHIPMENTREADYDATE:
  //         return this.findQuoteReqDetailByShipmentReadyDate;
  //       case FindQuoteReqDetailStrategy.SHIPMENTDEADLINE:
  //         return this.findQuoteReqDetailByShipmentDeadline;
  //       case FindQuoteReqDetailStrategy.CARGOINSURANCE:
  //         return this.findQuoteReqDetailByCargoInsurance;
  //       case FindQuoteReqDetailStrategy.QUOTEREQID:
  //         return this.findQuoteReqDetailByQuoteReqId;
  //     }
  //   }

  async createQuoteReqDetail(
    quoteReqDetailInfo: CreateQuoteReqDetailDto,
  ): Promise<QuoteReqDetail> {
    try {
      return await this.quoteReqDetail.create({
        origin: quoteReqDetailInfo.origin,
        destination: quoteReqDetailInfo.destination,
        shipmentReadyDate: quoteReqDetailInfo.shipmentReadyDate,
        shipmentDeadline: quoteReqDetailInfo.shipmentDeadline,
        cargoInsurance: quoteReqDetailInfo.cargoInsurance,
        shipmentType: quoteReqDetailInfo.shipmentType,
        quoteReqId: quoteReqDetailInfo.quoteReqId,
      });
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        throw new HttpException('Invalid foreign key.', HttpStatus.BAD_REQUEST);
      }
      if (error instanceof z.ZodError) {
        throw new HttpException(error.errors, HttpStatus.BAD_REQUEST);
      }
      throw new Error(error);
    }
  }

  async updateQuoteReqDetail(
    id: string,
    quoteReqDetailInfo: Partial<CreateQuoteReqDetailDto>,
  ): Promise<QuoteReqDetail> {
    try {
      const [affectedRows, [updateData]] = await this.quoteReqDetail.update(
        { ...quoteReqDetailInfo },
        { where: { id: id }, returning: true },
      );
      if (affectedRows == 0) {
        throw new NotFoundException(
          'Quote request detail id does not exists in database',
        );
      }
      return updateData.dataValues as QuoteReqDetail;
      // return await this.updateQuoteReqDetailStrategy.update(
      //   id,
      //   quoteReqDetailInfo,
      // );
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        throw new HttpException('Invalid foreign key.', HttpStatus.BAD_REQUEST);
      }
      if (error instanceof NotFoundException) {
        throw new HttpException(
          'Quote request detail id does not exists in database',
          HttpStatus.NOT_FOUND,
        );
      }
      throw new Error();
    }
  }
}
