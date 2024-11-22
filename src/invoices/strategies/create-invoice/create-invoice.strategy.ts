import { ConflictException, Injectable } from '@nestjs/common';
import { ICreateInvoiceStrategy } from './create-invoice-strategy.interface';
import { CreateInvoiceDto } from '@/invoices/dtos/create-invoice.dto';
import { Invoice } from '@/invoices/models/invoice.model';
import { InjectModel } from '@nestjs/sequelize';
import { ForeignKeyConstraintError } from 'sequelize';
import { InvoiceStatus } from '@/shared/enums/invoice-status.enum';

@Injectable()
export class CreateInvoiceStrategy implements ICreateInvoiceStrategy {
  constructor(
    @InjectModel(Invoice)
    private invoiceModel: typeof Invoice,
  ) {}
  async create(invoiceInfo: CreateInvoiceDto): Promise<Invoice> {
    try {
      const invoice = this.invoiceModel.create({
        invoiceDate: new Date(),
        status: InvoiceStatus.PENDING,
        taxAmount: invoiceInfo.taxAmount,
        totalAmount: invoiceInfo.totalAmount,
        expiredDate: invoiceInfo.expiredDate,
        employeeId: invoiceInfo.employeeId,
        contractId: invoiceInfo.contractId,
        paidAmount: 0,
      });
      return invoice;
    } catch (err) {
      if (err instanceof ForeignKeyConstraintError) {
        throw new ConflictException('Employee Id or Contract Id not found');
      }
    }
  }
}
