import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { QuotationReq } from './models/quotationReq.model';
import { QuotationReqsService } from './quotationReqs.service';
import { QuotationReqsController } from './quotationReqs.controller';

@Module({
  imports: [SequelizeModule.forFeature([QuotationReq])],
  providers: [QuotationReqsService],
  controllers: [QuotationReqsController],
})
export class QuotationReqsModule {}
