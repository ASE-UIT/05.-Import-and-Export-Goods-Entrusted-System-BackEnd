import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Shipment } from '@/shipment/models/shipment.model';
import { Document } from './models/document.model';

@Module({
  imports: [SequelizeModule.forFeature([Shipment, Document])],
  providers: [DocumentService],
  controllers: [DocumentController],
})
export class DocumentModule {}
