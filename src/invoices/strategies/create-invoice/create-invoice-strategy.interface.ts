import { CreateInvoiceDto } from '@/invoices/dtos/create-invoice.dto';
import { Invoice } from '@/invoices/models/invoice.model';

export interface ICreateInvoiceStrategy {
  create(invoiceInfo: CreateInvoiceDto): Promise<Invoice>;
}
