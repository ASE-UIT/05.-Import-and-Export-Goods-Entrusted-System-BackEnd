import { Injectable } from '@nestjs/common';
import { IFindInvoiceStrategy } from './find-invoice-strategy.interface';
import { Invoice } from '@/invoices/models/invoice.model';

@Injectable()
export class FindInvoiceById implements IFindInvoiceStrategy {
  find(invoiceId: string): Promise<Invoice[] | null> {
    return Invoice.findAll({
      where: { id: invoiceId },
      raw: true,
      nest: true,
    });
  }
}
