import {
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
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
import { InvoicesService } from './invoices.service';
import {
  CreateInvoiceDto,
  CreateInvoiceSchema,
  UpdateInvoiceDto,
} from './dtos/CreateInvoiceDto';
import { QueryInvoiceDto, QueryInvoiceSchema } from './dtos/QueryInvoiceDto';
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
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RoleGuard } from '@/shared/guards/role.guard';
import { RoleEnum } from '@/shared/enums/roles.enum';
import { Roles } from '@/shared/decorators/role.decorator';
import { InvoiceStatus } from '@/shared/enums/invoice-status.enum';
import { DataTypes } from 'sequelize';

@ApiTags('Invoices')
@Controller({
  path: 'invoices',
  version: '1',
})
export class InvoicesController {
  constructor(private invoicesService: InvoicesService) {}

  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUTANT])
  @Post()
  @ApiOperation({ summary: 'Create new invoice' })
  @ApiBody({
    type: CreateInvoiceDto,
  })
  @ApiCreatedResponse({ description: 'New invoice created' })
  @ApiBadRequestResponse({ description: 'Invalid body' })
  @ApiUnauthorizedResponse({
    description: 'Not logged in or account has unappropriate role',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong. Contact backend team at once',
  })
  async createInvoice(
    @Body(new ZodValidationPipe(CreateInvoiceSchema))
    body: CreateInvoiceDto,
  ): Promise<{ message: string; data: Invoice }> {
    const createRes = await this.invoicesService.create(body);
    return { message: 'Invoice created successfully', data: createRes };
  }

  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUTANT])
  @ApiOperation({ summary: 'Search for invoices' })
  @ApiQuery({
    name: 'id',
    type: String,
    required: false,
    description: 'Search invoice by id',
  })
  @ApiQuery({
    name: 'invoice date',
    type: Date,
    required: false,
    description: 'Search invoice by invoice date',
  })
  @ApiQuery({
    name: 'paid date',
    type: Date,
    required: false,
    description: 'Search invoice by paid date',
  })
  @ApiQuery({
    name: 'status',
    enum: InvoiceStatus,
    type: String,
    required: false,
    description: 'Search invoice by invoice status',
  })
  @ApiQuery({
    name: 'tax amount',
    type: Number,
    required: false,
    description: 'Search invoice by tax amount',
  })
  @ApiQuery({
    name: 'total amount',
    type: Number,
    required: false,
    description: 'Search invoice by total amount',
  })
  @ApiQuery({
    name: 'employee id',
    type: String,
    required: false,
    description: 'Search invoice by employee id',
  })
  @ApiQuery({
    name: 'contract id',
    type: String,
    required: false,
    description: 'Search invoice by contract id',
  })
  @ApiOkResponse({ description: 'invoice found' })
  @ApiNotFoundResponse({ description: 'invoice not found' })
  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong. Contact backend team at once',
  })
  @ApiUnauthorizedResponse({
    description: 'Not logged in or account has unappropriate role',
  })
  @Get()
  async findInvoice(
    @Query(new ZodValidationPipe(QueryInvoiceSchema))
    query: QueryInvoiceDto,
  ): Promise<Invoice[]> {
    if (Object.keys(query).length === 0) {
      return this.invoicesService.find(FindInvoiceStrategy.ALL, '');
    }
    const queryFields: { [key: string]: FindInvoiceStrategy } = {
      id: FindInvoiceStrategy.ID,
      invoiceDate: FindInvoiceStrategy.INVOICE_DATE,
      paidDate: FindInvoiceStrategy.PAID_DATE,
      status: FindInvoiceStrategy.STATUS,
      taxAmount: FindInvoiceStrategy.TAX_AMOUNT,
      totalAmount: FindInvoiceStrategy.TOTAL_AMOUNT,
      employeeId: FindInvoiceStrategy.EMPLOYEE_ID,
      contractId: FindInvoiceStrategy.CONTRACT_ID,
    };

    for (const [key, strategy] of Object.entries(queryFields)) {
      const value = query[key as keyof QueryInvoiceDto];
      if (value) {
        const invoice = await this.invoicesService.find(strategy, value);

        if (invoice.length > 0) {
          if (strategy === FindInvoiceStrategy.ALL || invoice.length > 1)
            return invoice;
          else return [invoice[0]];
        }
      }
    }

    throw new NotFoundException('Invoice not found');
  }

  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUTANT])
  @ApiOperation({ summary: "Update invoice's information" })
  @ApiOkResponse({ description: 'New information updated' })
  @ApiBadRequestResponse({ description: 'Empty body or misspelled property' })
  @ApiNotFoundResponse({ description: 'Could not find invoice to update' })
  @ApiUnauthorizedResponse({
    description: 'Not logged in or account has unappropriate role',
  })
  @ApiBody({
    type: UpdateInvoiceDto,
    examples: {
      example: {
        description: 'Able to update one or more fields in CreateInvoiceDto',
        value: {
          invoiceDate: '2022-1-1',
          paidDate: '2022-1-1',
          status: 'PENDING',
          totalAmount: 200,
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong. Contact backend team at once',
  })
  @Patch(':id')
  async updateInvoice(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(CreateInvoiceSchema.partial()))
    body: Partial<CreateInvoiceDto>,
  ): Promise<{ message: string; data: Invoice }> {
    const updateRes = await this.invoicesService.update(id, body);
    return { message: 'Invoice updated successfully', data: updateRes };
  }
}
