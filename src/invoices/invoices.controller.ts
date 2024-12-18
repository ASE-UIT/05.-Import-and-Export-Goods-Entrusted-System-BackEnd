import {
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
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
import { InvoicesService } from './invoices.service';
import {
  CreateInvoiceDto,
  CreateInvoiceSchema,
} from './dtos/create-invoice.dto';
import { QueryInvoiceDto, QueryInvoiceSchema } from './dtos/query-invoice.dto';
import { Invoice } from './models/invoice.model';
import { FindInvoiceStrategy } from './strategies/find-invoice/find-invoice-strategy.enum';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RoleGuard } from '@/shared/guards/role.guard';
import { RoleEnum } from '@/shared/enums/roles.enum';
import { Roles } from '@/shared/decorators/role.decorator';
import { InvoiceStatus } from '@/shared/enums/invoice-status.enum';
import { DataTypes, ValidationError } from 'sequelize';
import { createResponseType } from '@/shared/helpers/create-response.mixi';
import { SuccessResponse } from '@/shared/classes/success-response.class';
import {
  UpdateInvoiceDto,
  UpdateInvoiceSchema,
} from './dtos/update-invoice.dto';
import { PaginationDto, PaginationSchema } from '@/shared/dto/pagination.dto';

@ApiTags('Invoices')
@Controller({
  path: 'invoices',
  version: '1',
})
export class InvoicesController {
  constructor(private invoicesService: InvoicesService) {}

  @ApiOperation({ summary: 'Create a new invoice' })
  @ApiResponse({
    status: 201,
    description: 'Invoice created',
    type: createResponseType('Invoice created successfully', Invoice),
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body',
    type: ValidationError,
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication is required to create a invoice',
    type: UnauthorizedException,
    example: new UnauthorizedException(
      'Only authenticated users can access this resource',
    ).getResponse(),
  })
  @ApiResponse({
    status: 403,
    description:
      'Only user with role: [ADMIN | ACCOUNTANT] can perform this action',
    type: ForbiddenException,
    example: new ForbiddenException(
      'Only users with the following roles can access this resource: ADMIN, ACCOUNTANT',
    ).getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
    type: ForbiddenException,
    example: {
      NotFoundEmployee: {
        summary: 'The provided employeeId does not exist',
        value: new NotFoundException("Employee doesn't exist").getResponse(),
      },
      NotFoundContract: {
        summary: 'The provided contractId does not exist',
        value: new NotFoundException("Contract doesn't exist").getResponse(),
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    type: ValidationError,
  })
  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNTANT])
  @Post()
  async createInvoice(
    @Body(new ZodValidationPipe(CreateInvoiceSchema))
    body: CreateInvoiceDto,
  ) {
    const createRes = await this.invoicesService.create(body);
    return new SuccessResponse('Invoice created successfully', createRes);
  }

  @ApiOperation({ summary: 'Search for invoices' })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Current page',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Total records per page',
  })
  @ApiQuery({
    name: 'id',
    type: String,
    required: false,
    description: 'Search invoice by id',
  })
  @ApiQuery({
    name: 'invoiceDate',
    type: Date,
    required: false,
    description: 'Search invoice by invoice date',
  })
  @ApiQuery({
    name: 'paidDate',
    type: String,
    required: false,
    description: 'Search invoice by paid date',
  })
  @ApiQuery({
    name: 'expiredDate',
    type: Date,
    required: false,
    description: 'Search invoice by expired date',
  })
  @ApiQuery({
    name: 'status',
    enum: InvoiceStatus,
    required: false,
    description: 'Search invoice by invoice status',
  })
  @ApiQuery({
    name: 'taxAmount',
    type: Number,
    required: false,
    description: 'Search invoice by tax amount',
  })
  @ApiQuery({
    name: 'totalAmount',
    type: Number,
    required: false,
    description: 'Search invoice by total amount',
  })
  @ApiQuery({
    name: 'employeeId',
    type: String,
    required: false,
    description: 'Search invoice by employee id',
  })
  @ApiResponse({
    status: 200,
    description: 'Invoice found',
    type: Invoice,
  })
  @ApiResponse({
    status: 400,
    description: 'Unrecognized key(s) in query',
  })
  @ApiResponse({
    status: 401,
    description: "Authentication is required to find invoice's information",
    type: UnauthorizedException,
    example: new UnauthorizedException(
      'Only authenticated users can access this resource',
    ).getResponse(),
  })
  @ApiResponse({
    status: 403,
    description:
      'Only user with role: [ADMIN | ACCOUNTANT] can perform this action',
    type: ForbiddenException,

    example: new ForbiddenException(
      'Only users with the following roles can access this resource: ADMIN, ACCOUNTANT',
    ).getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'Invoice not found',
    type: NotFoundException,
    example: new NotFoundException('Invoice not found').getResponse(),
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    type: ValidationError,
  })
  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNTANT])
  @Get()
  async findInvoice(
    @Query(new ZodValidationPipe(QueryInvoiceSchema.partial()))
    query: QueryInvoiceDto,
    @Query(new ZodValidationPipe(PaginationSchema.partial()))
    pagination: Partial<PaginationDto>,
  ) {
    const foundRes = await this.invoicesService.find(query, pagination);
    return new SuccessResponse('Invoice found', foundRes);
  }

  @ApiOperation({ summary: "Update invoice's information" })
  @ApiBody({
    type: UpdateInvoiceDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Invoice updated',
    type: createResponseType('Invoice updated successfully', Invoice),
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body',
    type: ValidationError,
  })
  @ApiResponse({
    status: 401,
    description:
      "Authentication is required to update a contract's information",
    type: UnauthorizedException,
    example: new UnauthorizedException(
      'Only authenticated users can access this resource',
    ).getResponse(),
  })
  @ApiResponse({
    status: 403,
    description:
      'Only user with role: [ADMIN | ACCOUNTANT] can perform this action',
    type: ForbiddenException,
    example: new ForbiddenException(
      'Only users with the following roles can access this resource: ADMIN, ACCOUNTANT',
    ).getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'The provided contract information does not exist',
    type: NotFoundException,
    example: new NotFoundException('Invoice not found').getResponse(),
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    type: ValidationError,
  })
  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNTANT])
  @Patch(':id')
  async updateInvoice(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateInvoiceSchema.partial()))
    body: UpdateInvoiceDto,
  ): Promise<{ message: string; data: Invoice }> {
    const updateRes = await this.invoicesService.update(id, body);
    return new SuccessResponse('Invoice updated successfully', updateRes);
  }
}
