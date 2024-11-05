import { Injectable } from '@nestjs/common';
import { IFindInvoiceStrategy } from './find-invoice-strategy.interface';
import { Invoice } from '@/invoices/models/invoice.model';

@Injectable()
export class FindInvoiceByInvoiceDate implements IFindInvoiceStrategy {
  find(invoiceInvoiceDate: Date): Promise<Invoice[] | null> {
    return Invoice.findAll({
      where: { invoiceDate: invoiceInvoiceDate },
    });
  }
}
