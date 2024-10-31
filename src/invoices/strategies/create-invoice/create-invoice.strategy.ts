import { Injectable } from '@nestjs/common';
import { ICreateInvoiceStrategy } from './create-invoice-strategy.interface';
import { CreateInvoiceDto } from '@/invoices/dtos/CreateInvoiceDto';
import { Invoice } from '@/invoices/models/invoice.model';

@Injectable()
export class CreateInvoiceStrategy implements ICreateInvoiceStrategy {
  async create(invoiceInfo: CreateInvoiceDto): Promise<Invoice> {
    const invoice = new Invoice();
    invoice.invoiceDate = invoiceInfo.invoiceDate;
    invoice.paidDate = invoiceInfo.paidDate;
    invoice.status = invoiceInfo.status;
    invoice.taxAmount = invoiceInfo.taxAmount;
    invoice.totalAmount = invoiceInfo.totalAmount;
    invoice.employeeId = invoiceInfo.employeeId;
    invoice.contractId = invoiceInfo.contractId;
    await invoice.save();
    return invoice;
  }
}
