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
import { UpdateInvoiceDto } from './dtos/update-invoice.dto';
import { InvoiceStatus } from '@/shared/enums/invoice-status.enum';
import { UpdateStatusInvoiceStrategy } from './strategies/update-invoice/update-status-invoice.strategy';
import { UpdatePaidDateInvoiceStrategy } from './strategies/update-invoice/update-paid-date-invoice.strategy';
import { UpdatePaidAmountInvoiceStrategy } from './strategies/update-invoice/update-paid-amount-invoice.strategy';

@Injectable()
export class InvoicesService {
  constructor(
    private createInvoiceStrategy: CreateInvoiceStrategy,
    private updateInvoiceStrategy: UpdateInvoiceStrategy,
    private updateStatusInvoiceStrategy: UpdateStatusInvoiceStrategy,
    private findInvoiceStrategy: FindInvoiceStrategy,
    private updatePaidDateInvoiceStrategy: UpdatePaidDateInvoiceStrategy,
    private updatePaidAmountInvoiceStrategy: UpdatePaidAmountInvoiceStrategy,
  ) {}

  async updateInvoice(invoiceId: string, invoicePayment: Payment) {
    const foundInvoices = await this.find({ id: invoiceId });
    const findInvoice = foundInvoices[0];
    const updateFindInvoice = await this.updateInvoicePaidDate(
      findInvoice,
      invoicePayment.createdAt,
    );
    await this.updateInvoicePaidAmount(updateFindInvoice);
  }

  async updateInvoicePaidDate(invoice: Invoice, createdPayment: Date) {
    return await this.updatePaidDateInvoiceStrategy.update(
      invoice.id,
      createdPayment,
    );
  }

  async updateInvoiceStatus(invoice: Invoice) {
    if (
      invoice.status !== InvoiceStatus.PAID &&
      invoice.status !== InvoiceStatus.OVERDUE
    ) {
      if (invoice.paidDate !== null) {
        if (invoice.paidDate <= invoice.expiredDate) {
          if (invoice.paidAmount < invoice.totalAmount) {
            await this.updateStatusInvoiceStrategy.update(
              invoice.id,
              InvoiceStatus.PARTIALLY_PAID,
            );
          } else {
            await this.updateStatusInvoiceStrategy.update(
              invoice.id,
              InvoiceStatus.PAID,
            );
          }
        } else {
          await this.updateStatusInvoiceStrategy.update(
            invoice.id,
            InvoiceStatus.OVERDUE,
          );
        }
      } else {
        const now = new Date();
        if (now > invoice.expiredDate) {
          await this.updateStatusInvoiceStrategy.update(
            invoice.id,
            InvoiceStatus.OVERDUE,
          );
        }
      }
    }
  }
  // Switch status by method update by system (no status cancelled, refunded)
  // pending => partial_paid, paid, overdue
  // partial_paid => paid, overdue
  // paid => fixed
  // overdue => fixed

  // Switch status by method update by user (yes status cancelled, refunded)
  // pending => cancel
  // partially_paid => cancel, refund
  // paid => refund
  // overdue => cancel
  // cancel, refund => fixed

  async updateInvoiceStatusByUser(
    invoice: Invoice,
    updateStatus: InvoiceStatus,
  ) {
    if (
      invoice.status !== InvoiceStatus.CANCELLED &&
      invoice.status !== InvoiceStatus.REFUNDED
    ) {
      if (updateStatus === InvoiceStatus.CANCELLED) {
        if (
          invoice.status === InvoiceStatus.PENDING ||
          invoice.status === InvoiceStatus.PARTIALLY_PAID ||
          invoice.status === InvoiceStatus.OVERDUE
        ) {
          const updatedInvoice = await this.updateStatusInvoiceStrategy.update(
            invoice.id,
            updateStatus,
          );
          return updatedInvoice;
        } else
          throw new BadRequestException(
            "Can't set current invoice status to CANCELLED",
          );
      } else if (updateStatus === InvoiceStatus.REFUNDED) {
        if (
          invoice.status === InvoiceStatus.PARTIALLY_PAID ||
          invoice.status === InvoiceStatus.PAID
        ) {
          const updatedInvoice = await this.updateStatusInvoiceStrategy.update(
            invoice.id,
            updateStatus,
          );
          return updatedInvoice;
        } else
          throw new BadRequestException(
            "Can't set current invoice status to REFUNDED",
          );
      }
    }
    throw new BadRequestException("Can't set current invoice status anymore");
  }

  async updateInvoicePaidAmount(invoice: Invoice) {
    const paidAmount = await Payment.sum('amountPaid', {
      where: { invoiceId: invoice.id, status: 'COMPLETED' },
    });
    if (paidAmount === null) {
      const updateInvoice = await this.updatePaidAmountInvoiceStrategy.update(
        invoice.id,
        0,
      );
      await this.updateInvoiceStatus(updateInvoice);
    } else {
      const updateInvoice = await this.updatePaidAmountInvoiceStrategy.update(
        invoice.id,
        paidAmount,
      );
      await this.updateInvoiceStatus(updateInvoice);
    }
  }
  async create(invoiceInfo: CreateInvoiceDto): Promise<Invoice> {
    const createdInvoice = await this.createInvoiceStrategy.create(invoiceInfo);
    return createdInvoice;
  }

  async find(invoiceInfo: QueryInvoiceDto): Promise<Invoice[]> {
    const foundInvoices = await this.findInvoiceStrategy.find(invoiceInfo);
    return foundInvoices;
  }

  async update(
    invoiceID: string,
    updateInfo: UpdateInvoiceDto,
  ): Promise<Invoice> {
    if (Object.keys(updateInfo).length < 1) {
      throw new BadRequestException('Body is empty or invalid field names');
    }
    const foundInvoices = await this.find({ id: invoiceID });
    const findInvoice = foundInvoices[0];
    const updateInvoice = await this.updateInvoiceStatusByUser(
      findInvoice,
      updateInfo.status,
    );
    return updateInvoice;
  }
}
