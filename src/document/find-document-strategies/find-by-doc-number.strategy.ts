import { Document } from '../models/document.model';
import { IFindDocumentStrategy } from './find-document-strategy.interface';

export class FindDocumentByDocNumberStrategy implements IFindDocumentStrategy {
  async find(docNum: number): Promise<Document[]> {
    return Document.findAll({ where: { docNumber: docNum } });
  }
}
