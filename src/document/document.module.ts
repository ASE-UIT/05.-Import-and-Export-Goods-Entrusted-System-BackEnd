import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Shipment } from '@/shipment/models/shipment.model';
import { Document } from './models/document.model';
import { FindDocumentByDocNumberStrategy } from './find-document-strategies/find-by-doc-number.strategy';
import { FindDocumentByShipmentIdStrategy } from './find-document-strategies/find-by-shipment-id.strategy';
import { FindDocumentByTypeStrategy } from './find-document-strategies/find-by-type.strategy';
import { FindAllDocumentStrategy } from './find-document-strategies/find-all.strategy';

@Module({
  imports: [SequelizeModule.forFeature([Shipment, Document])],
  providers: [
    DocumentService,
    FindDocumentByDocNumberStrategy,
    FindDocumentByShipmentIdStrategy,
    FindDocumentByTypeStrategy,
    FindAllDocumentStrategy,
  ],
  controllers: [DocumentController],
})
export class DocumentModule {}
