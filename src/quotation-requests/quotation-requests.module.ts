import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { QuotationReq } from './models/quotationReq.model';
import { QuotationReqsService } from './quotation-requests.service';
import { QuotationReqsController } from './quotation-requests.controller';
import { CreateQuotationReqStrategy } from './strategies/create-quotationReq/create-quotationReq.strategy';
import { FindAllQuotationReqStrategy } from './strategies/find-quotationReq/find-all.strategy';
import { FindQuotationReqByRequestDateStrategy } from './strategies/find-quotationReq/find-by-requestDate.strategy';
import { FindQuotationReqByStatusStrategy } from './strategies/find-quotationReq/find-by-status.strategy';
import { UpdateQuotationReqStrategy } from './strategies/update-quotationReq/update-quotationReq.strategy';
import { QuoteReqDetail } from '@/quote-request-details/models/quoteReqDetail.model';
import { PackageDetail } from '@/package-details/models/packageDetails.model';
import { FindQuotationReqByUserIdStrategy } from './strategies/find-quotationReq/find-by-userId.strategy';
import { User } from '@/users/models/user.model';
import { Role } from '@/roles/models/role.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      QuotationReq,
      QuoteReqDetail,
      PackageDetail,
      User,
      Role,
    ]),
  ],
  providers: [
    QuotationReqsService,
    FindAllQuotationReqStrategy,
    FindQuotationReqByRequestDateStrategy,
    FindQuotationReqByStatusStrategy,
    FindQuotationReqByUserIdStrategy,
    CreateQuotationReqStrategy,
    UpdateQuotationReqStrategy,
  ],
  controllers: [QuotationReqsController],
})
export class QuotationReqsModule {}
