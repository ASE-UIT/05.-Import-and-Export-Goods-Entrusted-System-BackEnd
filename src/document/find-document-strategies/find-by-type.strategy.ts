import { Document } from '../models/document.model';
import { IFindDocumentStrategy } from './find-document-strategy.interface';

export class FindDocumentByTypeStrategy implements IFindDocumentStrategy {
  async find(docType: string): Promise<Document[]> {
    return Document.findAll({ where: { type: docType } });
  }
}
