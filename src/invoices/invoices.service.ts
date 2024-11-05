import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Invoice } from './models/invoice.model';
import { CreateInvoiceDto } from './dtos/create-invoice.dto';
import { QueryInvoiceDto } from './dtos/query-invoice.dto';
import { CreateInvoiceStrategy } from './strategies/create-invoice/create-invoice.strategy';
import { UpdateInvoiceStrategy } from './strategies/update-invoice/update-invoice.strategy';
import { FindAllInvoiceStrategy } from './strategies/find-invoice/find-all.strategy';

import { IFindInvoiceStrategy } from './strategies/find-invoice/find-invoice-strategy.interface';
import { FindInvoiceByEmployeeId } from './strategies/find-invoice/find-by-employee-id.strategy';
import { FindInvoiceByContractId } from './strategies/find-invoice/find-by-contract-id.strategy';
import { FindInvoiceById } from './strategies/find-invoice/find-by-id.strategy';
import { Payment } from '@/payment/models/payment.model';
import { resolve } from 'path';
import { FindInvoiceStrategy } from './strategies/find-invoice/find-invoice.strategy';

@Injectable()
export class InvoicesService {
  constructor(
    private createInvoiceStrategy: CreateInvoiceStrategy,
    private updateInvoiceStrategy: UpdateInvoiceStrategy,
    private findInvoiceStrategy: FindInvoiceStrategy,
  ) {}

  private async getInvoicesWithPaidAmount(invoices: Invoice[]): Promise<any[]> {
    const invoicesWithPaidAmount = await Promise.all(
      invoices.map(async (invoice) => {
        const totalPaidAmount = await Payment.sum('amountPaid', {
          where: { invoiceId: invoice.id, status: 'COMPLETED' },
        });

        if (totalPaidAmount === null)
          return { ...invoice.toJSON(), paidAmount: 0 };
        return { ...invoice.toJSON(), paidAmount: totalPaidAmount };
      }),
    );
    return invoicesWithPaidAmount;
  }

  private async getPaidAmount(invoice: Invoice): Promise<number> {
    const totalPaidAmount = await Payment.sum('amountPaid', {
      where: { invoiceId: invoice.id, status: 'COMPLETED' },
    });

    return totalPaidAmount ? totalPaidAmount : 0;
  }

  async create(invoiceInfo: CreateInvoiceDto): Promise<Invoice> {
    const createdInvoice = await this.createInvoiceStrategy.create(invoiceInfo);
    const createdInvoiceWithPaidAmount: any = {
      ...createdInvoice.toJSON(),
      paidAmount: 0,
    };
    return createdInvoiceWithPaidAmount;
  }

  async find(invoiceInfo: QueryInvoiceDto): Promise<Invoice[]> {
    const foundInvoices = await this.findInvoiceStrategy.find(invoiceInfo);
    if (foundInvoices.length > 0) {
      const foundInvoicesWithPaidAmount = this.getInvoicesWithPaidAmount(
        await foundInvoices,
      );
      return foundInvoicesWithPaidAmount;
    } else throw new NotFoundException('Invoice not found');
  }

  async update(
    invoiceID: string,
    updateInfo: Partial<CreateInvoiceDto>,
  ): Promise<Invoice> {
    if (Object.keys(updateInfo).length < 1) {
      throw new BadRequestException('Body is empty or invalid field names');
    }
    const updatedInvoice = await this.updateInvoiceStrategy.update(
      invoiceID,
      updateInfo,
    );
    (updatedInvoice as any).paidAmount =
      await this.getPaidAmount(updatedInvoice);
    return updatedInvoice;
  }
}
