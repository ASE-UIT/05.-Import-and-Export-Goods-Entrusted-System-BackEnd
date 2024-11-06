import { CreateInvoiceDto } from '@/invoices/dtos/create-invoice.dto';
import { Invoice } from '@/invoices/models/invoice.model';

export interface IUpdateInvoiceStrategy {
  update(
    invoiceId: string,
    udpateInfo: Partial<CreateInvoiceDto>,
  ): Promise<Invoice>;
}
