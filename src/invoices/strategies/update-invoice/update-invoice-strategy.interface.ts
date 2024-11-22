import { CreateInvoiceDto } from '@/invoices/dtos/create-invoice.dto';
import { UpdateInvoiceDto } from '@/invoices/dtos/update-invoice.dto';
import { Invoice } from '@/invoices/models/invoice.model';

export interface IUpdateInvoiceStrategy {
  update(invoiceId: string, udpateInfo: UpdateInvoiceDto): Promise<Invoice>;
}
