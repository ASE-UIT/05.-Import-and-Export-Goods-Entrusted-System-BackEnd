import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Document } from './models/document.model';
import {
  CreateDocumentDto,
  UpdateDocumentDto,
} from './dtos/create-document..dto';

import { ForeignKeyConstraintError, UniqueConstraintError } from 'sequelize';
import {
  ValidationError,
  ValidationErrorDetail,
} from '@/shared/classes/validation-error.class';
import { QueryDocumentDto } from './dtos/query-document.dto';

@Injectable()
export class DocumentService {
  constructor(
    @InjectModel(Document)
    private documentModel: typeof Document,
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
        throw new NotFoundException('Shipment id not found');
      if (err instanceof UniqueConstraintError) {
        const errors = err.errors.map(
          (error) => new ValidationErrorDetail(error.path, error.message),
        );
        throw new ConflictException(new ValidationError(errors));
      }
    }
  }

  async updateDocument(
    documentId: string,
    body: UpdateDocumentDto,
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
        const errors = err.errors.map(
          (error) => new ValidationErrorDetail(error.path, error.message),
        );
        throw new ConflictException(new ValidationError(errors));
      }
    }
  }

  async findDocument(query: QueryDocumentDto): Promise<Document[]> {
    let document: Document[];
    if (query) document = await Document.findAll({ where: query });
    else document = await Document.findAll();

    return document;
  }
}
