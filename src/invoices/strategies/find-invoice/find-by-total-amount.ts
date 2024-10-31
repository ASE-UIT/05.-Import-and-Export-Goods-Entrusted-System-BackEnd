import { Injectable } from '@nestjs/common';
import { IFindInvoiceStrategy } from './find-invoice-strategy.interface';
import { Invoice } from '@/invoices/models/invoice.model';

@Injectable()
export class FindInvoiceByTotalAmount implements IFindInvoiceStrategy {
  find(invoiceTotalAmount: number): Promise<Invoice[] | null> {
    return Invoice.findAll({
      where: { totalAmount: invoiceTotalAmount },
    });
  }
}
