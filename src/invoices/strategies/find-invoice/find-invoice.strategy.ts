import { Injectable } from '@nestjs/common';
import { IFindInvoiceStrategy } from './find-invoice-strategy.interface';
import { InjectModel } from '@nestjs/sequelize';
import { Invoice } from '@/invoices/models/invoice.model';
import { QueryInvoiceDto } from '@/invoices/dtos/query-invoice.dto';

@Injectable()
export class FindInvoiceStrategy implements IFindInvoiceStrategy {
  constructor(
    @InjectModel(Invoice)
    private invoiceModel: typeof Invoice,
  ) {}
  async find(invoiceInfo: QueryInvoiceDto): Promise<Invoice[] | null> {
    if (Object.keys(invoiceInfo).length < 1)
      return await this.invoiceModel.findAll();
    return await this.invoiceModel.findAll({ where: invoiceInfo });
  }
}
