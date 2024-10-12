import { CreateInvoiceDto } from '@/invoices/dtos/CreateInvoiceDto';
import { Invoice } from '@/invoices/models/invoice.model';

export interface ICreateInvoiceStrategy {
  create(invoiceInfo: CreateInvoiceDto): Promise<Invoice>;
}
