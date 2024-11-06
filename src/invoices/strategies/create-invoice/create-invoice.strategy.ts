import { ConflictException, Injectable } from '@nestjs/common';
import { ICreateInvoiceStrategy } from './create-invoice-strategy.interface';
import { CreateInvoiceDto } from '@/invoices/dtos/create-invoice.dto';
import { Invoice } from '@/invoices/models/invoice.model';
import { InjectModel } from '@nestjs/sequelize';
import { ForeignKeyConstraintError } from 'sequelize';

@Injectable()
export class CreateInvoiceStrategy implements ICreateInvoiceStrategy {
  constructor(
    @InjectModel(Invoice)
    private invoiceModel: typeof Invoice,
  ) {}
  async create(invoiceInfo: CreateInvoiceDto): Promise<Invoice> {
    try {
      const invoice = this.invoiceModel.create({
        invoiceDate: invoiceInfo.invoiceDate,
        paidDate: invoiceInfo.paidDate,
        status: invoiceInfo.status,
        taxAmount: invoiceInfo.taxAmount,
        totalAmount: invoiceInfo.totalAmount,
        employeeId: invoiceInfo.employeeId,
        contractId: invoiceInfo.contractId,
      });
      return invoice;
    } catch (err) {
      if (err instanceof ForeignKeyConstraintError) {
        throw new ConflictException('Employee Id or Contract Id not found');
      }
    }
  }
}
