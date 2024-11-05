import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Invoice } from './models/invoice.model';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { FindAllInvoiceStrategy } from './strategies/find-invoice/find-all.strategy';

import { CreateInvoiceStrategy } from './strategies/create-invoice/create-invoice.strategy';
import { UpdateInvoiceStrategy } from './strategies/update-invoice/update-invoice.strategy';
import { FindInvoiceByEmployeeId } from './strategies/find-invoice/find-by-employee-id.strategy';
import { FindInvoiceByContractId } from './strategies/find-invoice/find-by-contract-id.strategy';
import { Contract } from '@/contracts/models/contract.model';
import { Employee } from '@/employees/models/employee.model';
import { FindInvoiceById } from './strategies/find-invoice/find-by-id.strategy';
import { FindInvoiceStrategy } from './strategies/find-invoice/find-invoice.strategy';

@Module({
  imports: [SequelizeModule.forFeature([Invoice, Contract, Employee])],
  providers: [
    InvoicesService,
    CreateInvoiceStrategy,
    UpdateInvoiceStrategy,
    FindInvoiceStrategy,
  ],
  controllers: [InvoicesController],
})
export class InvoicesModule {}
