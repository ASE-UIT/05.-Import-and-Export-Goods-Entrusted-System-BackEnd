import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Shipment } from '@/shipment/models/shipment.model';

@Module({
  imports: [SequelizeModule.forFeature([Shipment])],
  providers: [DocumentService],
  controllers: [DocumentController],
})
export class DocumentModule {}
