import { Injectable } from '@nestjs/common';
import { IFindInvoiceStrategy } from './find-invoice-strategy.interface';
import { Invoice } from '@/invoices/models/invoice.model';

@Injectable()
export class FindInvoiceByEmployeeId implements IFindInvoiceStrategy {
  find(invoiceEmployeeId: string): Promise<Invoice[] | null> {
    return Invoice.findAll({
      where: { employeeId: invoiceEmployeeId },
      raw: true,
      nest: true,
    });
  }
}
