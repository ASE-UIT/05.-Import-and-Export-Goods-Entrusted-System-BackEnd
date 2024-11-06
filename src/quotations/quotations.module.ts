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

@Module({
  imports: [SequelizeModule.forFeature([Quotation])],
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
    CreateQuotationStrategy,
    UpdateQuotationStrategy,
  ],
})
export class QuotationsModule {}
