import { Module } from '@nestjs/common';
import { QuotationsController } from './quotations.controller';
import { QuotationsService } from './quotations.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Quotation } from './models/quotations.model';
import { FindAllQuotationStrategy } from './strategies/find-quotation/find-all.strategy';
import { FindQuotationByPickupDate } from './strategies/find-quotation/find-by-pickup-date';
import { FindQuotationByStatus } from './strategies/find-quotation/find-by-status';
import { FindQuotationByDeliveryDate } from './strategies/find-quotation/find-by-delivery-date';
import { FindQuotationByExpiredDate } from './strategies/find-quotation/find-by-expired-date';
import { FindQuotationByQuotationDate } from './strategies/find-quotation/find-by-quotation-date';
import { FindQuotationByTotalPrice } from './strategies/find-quotation/find-by-total-price';
import { CreateQuotationStrategy } from './strategies/create-quotation/create-quotation.strategy';
import { UpdateQuotationStrategy } from './strategies/update-quotation/update-quotation.strategy';
import { FindQuotationByEmployeeId } from './strategies/find-quotation/find-by-employee-id';
import { FindQuotationByUserId } from './strategies/find-quotation/find-by-user-id';
import { FindQuotationReqByUserIdStrategy } from '@/quotation-requests/strategies/find-quotationReq/find-by-userId.strategy';
import { QuotationReq } from '@/quotation-requests/models/quotationReq.model';
import { QuotationService } from '@/quotation-services/models/quotation-services.model';
import { Service } from '@/services/models/service.model';
import { QuoteReqDetail } from '@/quote-request-details/models/quoteReqDetail.model';
import { PackageDetail } from '@/package-details/models/packageDetails.model';
import { Freight } from '@/freights/models/freights.model';
import { AirFreight } from '@/air-freights/models/air-freights.model';
import { LandFreight } from '@/land-freights/models/land-freights.model';
import { FCL } from '@/fcls/models/fcls.model';
import { LCL } from '@/lcls/models/lcls.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Quotation,
      QuotationReq,
      QuoteReqDetail,
      PackageDetail,
      QuotationService,
      Service,
      Freight,
      AirFreight,
      LandFreight,
      FCL,
      LCL,
    ]),
  ],
  controllers: [QuotationsController],
  providers: [
    QuotationsService,
    FindAllQuotationStrategy,
    FindQuotationByPickupDate,
    FindQuotationByStatus,
    FindQuotationByDeliveryDate,
    FindQuotationByExpiredDate,
    FindQuotationByQuotationDate,
    FindQuotationByTotalPrice,
    FindQuotationByEmployeeId,
    FindQuotationByUserId,
    FindQuotationReqByUserIdStrategy,
    CreateQuotationStrategy,
    UpdateQuotationStrategy,
  ],
})
export class QuotationsModule {}
