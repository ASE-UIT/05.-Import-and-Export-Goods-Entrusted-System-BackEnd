import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { QuotationService } from './models/quotation-services.model';
import { QuotationServicesService } from './quotation-services.service';
import { QuotationServicesController } from './quotation-services.controller';

@Module({
  imports: [SequelizeModule.forFeature([QuotationService])],
  providers: [QuotationServicesService],
  controllers: [QuotationServicesController],
})
export class QuotationServicesModule {}
