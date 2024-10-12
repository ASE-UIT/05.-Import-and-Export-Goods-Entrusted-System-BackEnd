import { Invoice } from '@/invoices/models/invoice.model';

export interface IFindInvoiceStrategy {
  find(invoiceInfo: any): Promise<Invoice[] | null>;
}
