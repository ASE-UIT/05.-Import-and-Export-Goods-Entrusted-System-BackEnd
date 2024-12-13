import { DocumentType } from '@/shared/enums/document-type.enum';
import { Document } from '../models/document.model';
import { IFindDocumentStrategy } from './find-document-strategy.interface';

export class FindDocumentByTypeStrategy implements IFindDocumentStrategy {
  async find(docType: DocumentType): Promise<Document[]> {
    return Document.findAll({ where: { type: docType } });
  }
}
