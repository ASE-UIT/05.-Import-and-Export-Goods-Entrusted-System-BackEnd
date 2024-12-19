import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
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
import { ShipmentService } from '@/shipment/shipment.service';

@Injectable()
export class DocumentService {
  constructor(
    private shipmentService: ShipmentService,

    @InjectModel(Document)
    private documentModel: typeof Document,
  ) {}
  async createDocument(body: CreateDocumentDto) {
    const shipment = await this.shipmentService.findShipmentById(
      body.shipmentId,
    );
    const userId = shipment.contract.userId.toString();
    if (!userId)
      throw new InternalServerErrorException(
        'No user found for the contract, please report this to backend team',
      );
    try {
      const document = await this.documentModel.create({
        shipmentId: body.shipmentId,
        userId: userId,
        type: body.type,
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

  async findUserDocument(userId: string): Promise<Document[]> {
    const doc = await this.documentModel.findAll({
      where: { userId: userId },
    });
    if (!doc)
      throw new NotFoundException('User with provided userId not found');
    return doc;
  }
}
