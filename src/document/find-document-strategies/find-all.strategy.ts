import { Injectable } from '@nestjs/common';
import { Document } from '../models/document.model';

@Injectable()
export class FindAllDocumentStrategy {
  async find(): Promise<Document[]> {
    return Document.findAll();
  }
}
