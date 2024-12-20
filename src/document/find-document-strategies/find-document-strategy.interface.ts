import { DocumentType } from '@/shared/enums/document-type.enum';
import { Document } from '../models/document.model';

export interface IFindDocumentStrategy {
  find(documentInfo: string | number | DocumentType): Promise<Document[]>;
}
