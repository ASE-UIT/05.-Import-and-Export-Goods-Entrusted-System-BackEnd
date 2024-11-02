import { Document } from '../models/document.model';

export interface IFindDocumentStrategy {
  find(documentInfo: string | number): Promise<Document[]>;
}
