import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Invoice } from './models/invoice.model';
import { CreateInvoiceDto } from './dtos/CreateInvoiceDto';
import { QueryInvoiceDto } from './dtos/QueryInvoiceDto';
import { CreateInvoiceStrategy } from './strategies/create-invoice/create-invoice.strategy';
import { UpdateInvoiceStrategy } from './strategies/update-invoice/update-invoice.strategy';
import { FindAllInvoiceStrategy } from './strategies/find-invoice/find-all.strategy';
import { FindInvoiceByPaidDate } from './strategies/find-invoice/find-by-paid-date.strategy';
import { FindInvoiceByInvoiceDate } from './strategies/find-invoice/find-by-invoice-date.strategy';
import { FindInvoiceByStatus } from './strategies/find-invoice/find-by-status.strategy';
import { FindInvoiceByTaxAmount } from './strategies/find-invoice/find-by-tax-amount.strategy';
import { FindInvoiceByTotalAmount } from './strategies/find-invoice/find-by-total-amount.strategy';
import { FindInvoiceStrategy } from './strategies/find-invoice/find-invoice-strategy.enum';
import { IFindInvoiceStrategy } from './strategies/find-invoice/find-invoice-strategy.interface';
import { FindInvoiceByEmployeeId } from './strategies/find-invoice/find-by-employee-id.strategy';
import { FindInvoiceByContractId } from './strategies/find-invoice/find-by-contract-id.strategy';
import { FindInvoiceById } from './strategies/find-invoice/find-by-id.strategy';
import { Payment } from '@/payment/models/payment.model';
import { resolve } from 'path';

@Injectable()
export class InvoicesService {
  constructor(
    private findAllInvoiceStrategy: FindAllInvoiceStrategy,
    private findInvoiceById: FindInvoiceById,
    private findInvoiceByInvoiceDate: FindInvoiceByInvoiceDate,
    private findInvoiceByPaidDate: FindInvoiceByPaidDate,
    private findInvoiceByStatus: FindInvoiceByStatus,
    private findInvoiceByTaxAmount: FindInvoiceByTaxAmount,
    private findInvoiceByTotalAmount: FindInvoiceByTotalAmount,
    private findInvoiceByEmployeeId: FindInvoiceByEmployeeId,
    private findInvoiceByContractId: FindInvoiceByContractId,
    private createInvoiceStrategy: CreateInvoiceStrategy,
    private updateInvoiceStrategy: UpdateInvoiceStrategy,
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

  async find(
    strategy: FindInvoiceStrategy,
    invoiceInfo: any,
  ): Promise<Invoice[]> {
    const findStrategy = this.getFindStrategy(strategy);
    const foundInvoices = findStrategy.find(invoiceInfo);
    const foundInvoicesWithPaidAmount = this.getInvoicesWithPaidAmount(
      await foundInvoices,
    );
    return foundInvoicesWithPaidAmount;
  }

  getFindStrategy(strategy: FindInvoiceStrategy): IFindInvoiceStrategy {
    switch (strategy) {
      case FindInvoiceStrategy.ALL:
        return this.findAllInvoiceStrategy;
      case FindInvoiceStrategy.ID:
        return this.findInvoiceById;
      case FindInvoiceStrategy.INVOICE_DATE:
        return this.findInvoiceByInvoiceDate;
      case FindInvoiceStrategy.STATUS:
        return this.findInvoiceByStatus;
      case FindInvoiceStrategy.PAID_DATE:
        return this.findInvoiceByPaidDate;
      case FindInvoiceStrategy.TAX_AMOUNT:
        return this.findInvoiceByTaxAmount;
      case FindInvoiceStrategy.TOTAL_AMOUNT:
        return this.findInvoiceByTotalAmount;
      case FindInvoiceStrategy.EMPLOYEE_ID:
        return this.findInvoiceByEmployeeId;
      case FindInvoiceStrategy.CONTRACT_ID:
        return this.findInvoiceByContractId;
    }
  }

  async update(
    invoiceID: string,
    updateInfo: Partial<CreateInvoiceDto>,
  ): Promise<Invoice> {
    if (Object.keys(updateInfo).length < 1) {
      throw new BadRequestException('Body is empty');
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
