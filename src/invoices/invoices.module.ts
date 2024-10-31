import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Invoice } from './models/invoice.model';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { FindAllInvoiceStrategy } from './strategies/find-invoice/find-all.strategy';
import { FindInvoiceByInvoiceDate } from './strategies/find-invoice/find-by-invoice-date';
import { FindInvoiceByPaidDate } from './strategies/find-invoice/find-by-paid-date';
import { FindInvoiceByStatus } from './strategies/find-invoice/find-by-status';
import { FindInvoiceByTaxAmount } from './strategies/find-invoice/find-by-tax-amount';
import { FindInvoiceByTotalAmount } from './strategies/find-invoice/find-by-total-amount';
import { CreateInvoiceStrategy } from './strategies/create-invoice/create-invoice.strategy';
import { UpdateInvoiceStrategy } from './strategies/update-invoice/update-invoice.strategy';

@Module({
  imports: [SequelizeModule.forFeature([Invoice])],
  providers: [
    InvoicesService,
    FindAllInvoiceStrategy,
    FindInvoiceByInvoiceDate,
    FindInvoiceByPaidDate,
    FindInvoiceByStatus,
    FindInvoiceByTaxAmount,
    FindInvoiceByTotalAmount,
    CreateInvoiceStrategy,
    UpdateInvoiceStrategy,
  ],
  controllers: [InvoicesController],
})
export class InvoicesModule {}
