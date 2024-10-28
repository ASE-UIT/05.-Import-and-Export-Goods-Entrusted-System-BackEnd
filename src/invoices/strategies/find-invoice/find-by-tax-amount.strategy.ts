import { Injectable } from '@nestjs/common';
import { IFindInvoiceStrategy } from './find-invoice-strategy.interface';
import { Invoice } from '@/invoices/models/invoice.model';

@Injectable()
export class FindInvoiceByTaxAmount implements IFindInvoiceStrategy {
  find(invoiceTaxAmount: number): Promise<Invoice[] | null> {
    return Invoice.findAll({
      where: { taxAmount: invoiceTaxAmount },
    });
  }
}
