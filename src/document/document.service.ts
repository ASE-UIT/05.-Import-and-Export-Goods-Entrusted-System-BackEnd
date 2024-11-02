import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Document } from './models/document.model';
import { CreateDocumentDto } from './dtos/create-document..dto';
import { ShipmentService } from '@/shipment/shipment.service';
import { Shipment } from '@/shipment/models/shipment.model';
import { ForeignKeyConstraintError, UniqueConstraintError } from 'sequelize';
import { FindAllDocumentStrategy } from './find-document-strategies/find-all.strategy';
import { FindDocumentByShipmentIdStrategy } from './find-document-strategies/find-by-shipment-id.strategy';
import { FindDocumentByTypeStrategy } from './find-document-strategies/find-by-type.strategy';
import { FindDocumentByDocNumberStrategy } from './find-document-strategies/find-by-doc-number.strategy';
import { FindDocumentStrategies } from './find-document-strategies/find-document-strategy.enum';
import { IFindDocumentStrategy } from './find-document-strategies/find-document-strategy.interface';

@Injectable()
export class DocumentService {
  constructor(
    @InjectModel(Document)
    private documentModel: typeof Document,
    private findAllDocument: FindAllDocumentStrategy,
    private findDocumentByShipmentId: FindDocumentByShipmentIdStrategy,
    private findDocumentByType: FindDocumentByTypeStrategy,
    private findDocumentByDocNumber: FindDocumentByDocNumberStrategy,
  ) {}
  async createDocument(body: CreateDocumentDto): Promise<Document> {
    try {
      const document = await this.documentModel.create({
        shipmentId: body.shipmentId,
        type: body.type,
        image: body.image,
        docNumber: body.docNumber,
      });
      return document;
    } catch (err) {
      if (err instanceof ForeignKeyConstraintError)
        throw new NotFoundException('Shipment not found');
      if (err instanceof UniqueConstraintError)
        throw new ConflictException(err.errors[0].message);
    }
  }

  async updateDocument(
    documentId: string,
    body: Partial<CreateDocumentDto>,
  ): Promise<Document> {
    try {
      const [affectedRows, [updateData]] = await this.documentModel.update(
        { ...body },
        { where: { id: documentId }, returning: true },
      );
      return updateData.dataValues as Document;
    } catch (err) {
      if (err instanceof TypeError) {
        throw new NotFoundException('Document not found');
      }
      if (err instanceof UniqueConstraintError) {
        throw new ConflictException(err.errors[0].message);
      }
    }
  }

  getFindStrategy(strategy: FindDocumentStrategies): IFindDocumentStrategy {
    switch (strategy) {
      case FindDocumentStrategies.ALL:
        return this.findAllDocument;
      case FindDocumentStrategies.DOC_NUMBER:
        return this.findDocumentByDocNumber;
      case FindDocumentStrategies.SHIPMENT_ID:
        return this.findDocumentByShipmentId;
      case FindDocumentStrategies.TYPE:
        return this.findDocumentByType;
    }
  }

  async findDocument(
    strategy: FindDocumentStrategies,
    documentInfo: string | number,
  ) {
    const findStrat = this.getFindStrategy(strategy);
    const document = findStrat.find(documentInfo);
    return document;
  }
}
