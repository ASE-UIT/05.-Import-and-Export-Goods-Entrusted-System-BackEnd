import { Document } from '../models/document.model';
import { IFindDocumentStrategy } from './find-document-strategy.interface';

export class FindDocumentByShipmentIdStrategy implements IFindDocumentStrategy {
  async find(id: string): Promise<Document[]> {
    return Document.findAll({ where: { shipmentId: id } });
  }
}
