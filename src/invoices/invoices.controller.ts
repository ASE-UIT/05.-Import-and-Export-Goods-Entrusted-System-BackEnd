import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto, CreateInvoiceSchema } from './dtos/CreateInvoiceDto';
import { QueryInvoiceDto, QueryInvoiceSchema } from './dtos/QueryInvoiceDto';
import { Invoice } from './models/invoice.model';
import { FindInvoiceStrategy } from './strategies/find-invoice/find-invoice-strategy.enum';

@Controller({
  path: 'invoices',
  version: '1',
})
export class InvoicesController {
  constructor(private invoicesService: InvoicesService) {}

  @Post()
  async createInvoice(
    @Body(new ZodValidationPipe(CreateInvoiceSchema))
    body: CreateInvoiceDto,
  ): Promise<{ message: string; data: Invoice }> {
    const createRes = await this.invoicesService.create(body);
    return createRes;
  }

  @Get()
  async findInvoice(
    @Query(new ZodValidationPipe(QueryInvoiceSchema))
    query: QueryInvoiceDto,
  ): Promise<Invoice[]> {
    if (Object.keys(query).length === 0) {
      return this.invoicesService.find(FindInvoiceStrategy.ALL, '');
    }
    const queryFields: { [key: string]: FindInvoiceStrategy } = {
      invoiceDate: FindInvoiceStrategy.INVOICE_DATE,
      paidDate: FindInvoiceStrategy.PAID_DATE,
      status: FindInvoiceStrategy.STATUS,
      taxAmount: FindInvoiceStrategy.TAX_AMOUNT,
      totalAmount: FindInvoiceStrategy.TOTAL_AMOUNT,
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

  @Patch(':id')
  async updateInvoice(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(CreateInvoiceSchema.partial()))
    body: Partial<CreateInvoiceDto>,
  ): Promise<{ message: string; data: Invoice }> {
    const updateRes = await this.invoicesService.update(id, body);
    return updateRes;
  }
}
