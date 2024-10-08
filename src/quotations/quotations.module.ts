import { Module } from '@nestjs/common';
import { QuotationsController } from './quotations.controller';
import { QuotationsService } from './quotations.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Quotation } from './models/quotations.model';

@Module({
  imports: [SequelizeModule.forFeature([Quotation])],
  controllers: [QuotationsController],
  providers: [QuotationsService],
})
export class QuotationsModule {}
