import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Invoice } from './models/invoice.model';
import { CreateInvoiceDto } from './dtos/CreateInvoiceDto';
import { QueryInvoiceDto } from './dtos/QueryInvoiceDto';
import { Invoice } from './models/invoice.model';
import { CreateInvoiceDto } from './dtos/CreateInvoiceDto';
import { CreateInvoiceStrategy } from './strategies/create-invoice/create-invoice.strategy';
import { UpdateInvoiceStrategy } from './strategies/update-invoice/update-invoice.strategy';
import { FindAllInvoiceStrategy } from './strategies/find-invoice/find-all.strategy';
import { FindInvoiceByPaidDate } from './strategies/find-invoice/find-by-paid-date';
import { FindInvoiceByInvoiceDate } from './strategies/find-invoice/find-by-invoice-date';
import { FindInvoiceByStatus } from './strategies/find-invoice/find-by-status';
import { FindInvoiceByTaxAmount } from './strategies/find-invoice/find-by-tax-amount';
import { FindInvoiceByTotalAmount } from './strategies/find-invoice/find-by-total-amount';
import { FindInvoiceStrategy } from './strategies/find-invoice/find-invoice-strategy.enum';
import { IFindInvoiceStrategy } from './strategies/find-invoice/find-invoice-strategy.interface';

@Injectable()
export class InvoicesService {
  constructor(
    private findAllInvoiceStrategy: FindAllInvoiceStrategy,
    private findInvoiceByInvoiceDate: FindInvoiceByInvoiceDate,
    private findInvoiceByPaidDate: FindInvoiceByPaidDate,
    private findInvoiceByStatus: FindInvoiceByStatus,
    private findInvoiceByTaxAmount: FindInvoiceByTaxAmount,
    private findInvoiceByTotalAmount: FindInvoiceByTotalAmount,
    private createInvoiceStrategy: CreateInvoiceStrategy,
    private updateInvoiceStrategy: UpdateInvoiceStrategy,
  ) {}

  async create(
    invoiceInfo: CreateInvoiceDto,
  ): Promise<{ message: string; data: Invoice }> {
    const createdInvoice = await this.createInvoiceStrategy.create(invoiceInfo);
    return { message: 'Invoice created', data: createdInvoice };
  }


  find(
    strategy: FindInvoiceStrategy,
    invoiceInfo: any,
  ): Promise<Invoice[] | null> {
  find(strategy: FindInvoiceStrategy, invoiceInfo: any): Promise<Invoice[]> {
    const findStrategy = this.getFindStrategy(strategy);
    const invoice = findStrategy.find(invoiceInfo);
    return invoice;
  }

  getFindStrategy(strategy: FindInvoiceStrategy): IFindInvoiceStrategy {
    switch (strategy) {
      case FindInvoiceStrategy.ALL:
        return this.findAllInvoiceStrategy;
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
    }
  }

  async update(
    invoiceID: string,
    updateInfo: Partial<CreateInvoiceDto>,
  ): Promise<{ message: string; data: Invoice }> {
    if (Object.keys(updateInfo).length < 1) {
      throw new BadRequestException('Body is empty');
    }
    const updatedResponse = await this.updateInvoiceStrategy.update(
      invoiceID,
      updateInfo,
    );
    return { message: 'Invoice updated', data: updatedResponse };
  }
}
