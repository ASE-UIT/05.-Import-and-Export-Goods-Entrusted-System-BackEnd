import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { ZodValidationPipe } from 'nestjs-zod';
import {
  CreateDocumentDto,
  CreateDocumentSchema,
} from './dtos/create-document..dto';
import {
  QueryDocumentDto,
  QueryDocumentSchema,
} from './dtos/query-document.dto';
import { FindDocumentStrategies } from './find-document-strategies/find-document-strategy.enum';
import { RoleGuard } from '@/shared/guards/role.guard';
import { Roles } from '@/shared/decorators/role.decorator';
import { RoleEnum } from '@/shared/enums/roles.enum';

@Controller({ path: 'document', version: '1' })
export class DocumentController {
  constructor(private documentService: DocumentService) {}

  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.DOCUMENTATION])
  @Post()
  async createDocument(
    @Body(new ZodValidationPipe(CreateDocumentSchema)) body: CreateDocumentDto,
  ) {
    const result = await this.documentService.createDocument(body);
    return { message: 'New document created', data: result };
  }

  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.DOCUMENTATION])
  @Patch(':id')
  async updateDocument(
    @Param('id') id: string,
    @Body(
      new ZodValidationPipe(
        CreateDocumentSchema.partial().omit({ shipmentId: true }),
      ),
    )
    body: Partial<CreateDocumentDto>,
  ) {
    if (Object.keys(body).length === 0)
      throw new BadRequestException('Body is empty or invalid field names');
    const result = await this.documentService.updateDocument(id, body);
    return { message: 'Document updated', data: result };
  }

  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.DOCUMENTATION])
  @Get()
  async findDocument(
    @Query(new ZodValidationPipe(QueryDocumentSchema.partial()))
    query: Partial<QueryDocumentDto>,
  ) {
    if (Object.keys(query).length === 0)
      return await this.documentService.findDocument(
        FindDocumentStrategies.ALL,
        '',
      );

    // Get query fields

    const queryFields: { [key: string]: FindDocumentStrategies } = {
      shipmentId: FindDocumentStrategies.SHIPMENT_ID,
      docNumber: FindDocumentStrategies.DOC_NUMBER,
      type: FindDocumentStrategies.TYPE,
    };

    // Assign corrisponding strategy to query fields
    for (const [key, strategy] of Object.entries(queryFields)) {
      const value = query[key as keyof QueryDocumentDto];
      if (value) {
        const shipment = await this.documentService.findDocument(
          strategy,
          value,
        );
        if (shipment.length > 0) {
          if (strategy === FindDocumentStrategies.ALL || shipment.length > 1)
            return shipment;
          else return shipment[0];
        }
      }
    }

    // Cant find document
    throw new NotFoundException('Document not found');
  }
}
