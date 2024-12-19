import {
  BadRequestException,
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
import { z } from 'zod';
import { resolveScope } from 'sequelize-typescript';

@Injectable()
export class DocumentService {
  constructor(
    private shipmentService: ShipmentService,
    @InjectModel(Document)
    private documentModel: typeof Document,
  ) {}
  async createDocument(body: CreateDocumentDto) {
    if (body.type && body.schema) {
      const { success, error } = checkBodySchema(body.fields, body.schema);

      if (!success) {
        const errDetails: ValidationErrorDetail[] = error.errors.map((err) => {
          return new ValidationErrorDetail(err.path.toString(), err.message);
        });
        throw new BadRequestException(new ValidationError(errDetails));
      }
    }

    const shipment = await this.shipmentService.findShipmentById(
      body.shipmentId,
    );
    const userId = shipment.contract.userId.toString();
    if (!userId)
      throw new InternalServerErrorException(
        'No user found for the contract, please report this to backend team',
      );

    const docExists =
      (
        await this.documentModel.findAll({
          where: { shipmentId: body.shipmentId, type: body.type },
        })
      ).length > 0;

    if (docExists)
      throw new ConflictException(
        new ValidationError([
          new ValidationErrorDetail(
            'type',
            'Document for this shipment has already been provided',
          ),
        ]),
      );

    try {
      const document = await this.documentModel.create({
        shipmentId: body.shipmentId,
        userId: userId,
        type: body.type,
        docNumber: body.docNumber,
        fields: body.fields,
        schema: body.schema,
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

  async findDocumentById(id: string): Promise<Document[]> {
    const doc = await this.documentModel.findAll({
      where: { id: id },
    });
    if (!doc) throw new NotFoundException('Document not found');
    return doc;
  }
}

function checkBodySchema(body: object, schema: object) {
  const dynamicSchema = createDynamicSchema(schema);
  const result = dynamicSchema.safeParse(body);
  return result;
}

function createDynamicSchema(schema: object) {
  const schemaEntries = Object.entries(schema);
  const validationObject: Record<string, z.ZodType> = {};

  for (const [key, type] of schemaEntries) {
    switch (type.toLowerCase()) {
      case 'string':
        validationObject[key] = z.string();
        break;
      case 'number':
        validationObject[key] = z.number();
        break;
      case 'array':
        validationObject[key] = z.array(z.unknown());
        break;
      default:
        validationObject[key] = z.any();
    }
  }
  return z.object(validationObject);
}
