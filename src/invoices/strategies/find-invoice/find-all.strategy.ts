import { Injectable } from '@nestjs/common';
import { IFindInvoiceStrategy } from './find-invoice-strategy.interface';
import { Invoice } from '@/invoices/models/invoice.model';

@Injectable()
export class FindAllInvoiceStrategy implements IFindInvoiceStrategy {
  async find(): Promise<Invoice[] | null> {
    return Invoice.findAll();
  }
}
