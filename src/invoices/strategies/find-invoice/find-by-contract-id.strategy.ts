import { Injectable } from '@nestjs/common';
import { IFindInvoiceStrategy } from './find-invoice-strategy.interface';
import { Invoice } from '@/invoices/models/invoice.model';

@Injectable()
export class FindInvoiceByContractId implements IFindInvoiceStrategy {
  find(invoiceContractId: string): Promise<Invoice[] | null> {
    return Invoice.findAll({
      where: { contractId: invoiceContractId },
      raw: true,
      nest: true,
    });
  }
}
