import { Injectable } from '@nestjs/common';
import { IFindInvoiceStrategy } from './find-invoice-strategy.interface';
import { Invoice } from '@/invoices/models/invoice.model';

@Injectable()
export class FindInvoiceByPaidDate implements IFindInvoiceStrategy {
  find(invoicePaidDate: Date): Promise<Invoice[] | null> {
    return Invoice.findAll({
      where: { paidDate: invoicePaidDate },
    });
  }
}
