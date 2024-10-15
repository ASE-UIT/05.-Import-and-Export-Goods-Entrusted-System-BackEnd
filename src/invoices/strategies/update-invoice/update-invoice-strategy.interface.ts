import { CreateInvoiceDto } from '@/invoices/dtos/CreateInvoiceDto';
import { Invoice } from '@/invoices/models/invoice.model';

export interface IUpdateInvoiceStrategy {
  update(
    invoiceId: string,
    udpateInfo: Partial<CreateInvoiceDto>,
  ): Promise<Invoice>;
}
