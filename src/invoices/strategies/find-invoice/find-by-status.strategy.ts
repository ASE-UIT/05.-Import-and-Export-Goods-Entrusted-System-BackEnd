import { InvoiceStatus } from '@/shared/enums/invoice-status.enum';
import { IFindInvoiceStrategy } from './find-invoice-strategy.interface';
import { Injectable } from '@nestjs/common';
import { Invoice } from '@/invoices/models/invoice.model';

@Injectable()
export class FindInvoiceByStatus implements IFindInvoiceStrategy {
  find(invoiceStatus: InvoiceStatus): Promise<Invoice[] | null> {
    return Invoice.findAll({
      where: { status: invoiceStatus },
    });
  }
}
