import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { ZodValidationPipe } from 'nestjs-zod';
import {
  CreateDocumentDto,
  CreateDocumentSchema,
  UpdateDocumentDto,
} from './dtos/create-document..dto';
import {
  QueryDocumentDto,
  QueryDocumentSchema,
} from './dtos/query-document.dto';
import { RoleGuard } from '@/shared/guards/role.guard';
import { Roles } from '@/shared/decorators/role.decorator';
import { RoleEnum } from '@/shared/enums/roles.enum';
import { SuccessResponse } from '@/shared/classes/success-response.class';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { createResponseType } from '@/shared/helpers/create-response.mixin';
import { ValidationError } from '@/shared/classes/validation-error.class';
import { Document } from './models/document.model';

@ApiTags('Document')
@Controller({ path: 'document', version: '1' })
export class DocumentController {
  constructor(private documentService: DocumentService) {}

  @ApiOperation({ summary: 'Create a new document' })
  @ApiResponse({
    status: 201,
    description: 'New document created',
    type: createResponseType('New document created', Document),
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body',
    type: ValidationError,
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication is required to create a document',
    type: UnauthorizedException,
    example: new UnauthorizedException(
      'Only authenticated users can access this resource',
    ).getResponse(),
  })
  @ApiResponse({
    status: 403,
    description:
      'Only user with role: [ADMIN | DOCUMENTATION] can perform this action',
    type: ForbiddenException,
    example: new ForbiddenException(
      'Only users with the following roles can access this resource: ADMIN, DOCUMENTATION',
    ).getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'The provided document information does not exist',
    type: NotFoundException,
    example: new NotFoundException('Shipment not found').getResponse(),
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    type: ValidationError,
  })
  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.DOCUMENTATION])
  @Post()
  async createDocument(
    @Body(new ZodValidationPipe(CreateDocumentSchema)) body: CreateDocumentDto,
  ) {
    const result = await this.documentService.createDocument(body);
    return new SuccessResponse('New document created', result);
  }

  @ApiOperation({ summary: "Update a document's information" })
  @ApiBody({
    type: UpdateDocumentDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Document updated',
    type: createResponseType('Document updated', Document),
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body',
    type: ValidationError,
  })
  @ApiResponse({
    status: 401,
    description:
      "Authentication is required to update a document's information",
    type: UnauthorizedException,
    example: new UnauthorizedException(
      'Only authenticated users can access this resource',
    ).getResponse(),
  })
  @ApiResponse({
    status: 403,
    description:
      'Only user with role: [ADMIN | DOCUMENTATION] can perform this action',
    type: ForbiddenException,
    example: new ForbiddenException(
      'Only users with the following roles can access this resource: ADMIN, DOCUMENTATION',
    ).getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'The provided documnent information does not exist',
    type: NotFoundException,
    example: new NotFoundException('Document not found').getResponse(),
  })
  @ApiResponse({ status: 409, description: 'Conflict', type: ValidationError })
  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.DOCUMENTATION])
  @Patch(':id')
  async updateDocument(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateDocumentDto))
    body: UpdateDocumentDto,
  ) {
    if (Object.keys(body).length === 0)
      throw new BadRequestException('Body is empty or invalid field names');
    const result = await this.documentService.updateDocument(id, body);
    return new SuccessResponse('Document updated', result);
  }

  @ApiOperation({ summary: 'Search for documents' })
  @ApiQuery({
    name: 'shipmentId',
    type: String,
    required: false,
    description: 'Search document by shipment id',
  })
  @ApiQuery({
    name: 'type',
    type: String,
    required: false,
    description: 'Search document by document type',
  })
  @ApiQuery({
    name: 'docNumber',
    type: String,
    required: false,
    description: 'Search document by document number',
  })
  @ApiResponse({
    status: 200,
    description: 'Document founded',
    type: Document,
  })
  @ApiResponse({
    status: 400,
    description: 'Unrecognized key(s) in query',
  })
  @ApiResponse({
    status: 401,
    description: "Authentication is required to find a document's information",
    type: UnauthorizedException,
    example: new UnauthorizedException(
      'Only authenticated users can access this resource',
    ).getResponse(),
  })
  @ApiResponse({
    status: 403,
    description:
      'Only user with role: [ADMIN | DOCUMENTATION] can perform this action',
    type: ForbiddenException,

    example: new ForbiddenException(
      'Only users with the following roles can access this resource: ADMIN, DOCUMENTATION',
    ).getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'Document not found',
    type: NotFoundException,
    example: new NotFoundException('Document not found').getResponse(),
  })
  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.DOCUMENTATION])
  @Get()
  async findDocument(
    @Query(new ZodValidationPipe(QueryDocumentSchema.partial().strict()))
    query: Partial<QueryDocumentDto>,
  ) {
    const result = await this.documentService.findDocument(query);
    return new SuccessResponse('Document found', result);
  }
}