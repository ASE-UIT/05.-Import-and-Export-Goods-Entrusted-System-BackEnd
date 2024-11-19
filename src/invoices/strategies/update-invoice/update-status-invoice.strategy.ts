import { Invoice } from '@/invoices/models/invoice.model';
import { InvoiceStatus } from '@/shared/enums/invoice-status.enum';
import { InjectModel } from '@nestjs/sequelize';
import { IUpdateInvoiceStrategy } from './update-invoice-strategy.interface';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UpdateStatusInvoiceStrategy {
  constructor(
    @InjectModel(Invoice)
    private invoiceModel: typeof Invoice,
  ) {}
  async update(
    invoiceId: string,
    invoiceStatus: InvoiceStatus,
  ): Promise<Invoice> {
    try {
      const [affetedRows, [updateData]] = await this.invoiceModel.update(
        { status: invoiceStatus },
        { where: { id: invoiceId }, returning: true },
      );
      return updateData;
    } catch (err) {
      if (err instanceof TypeError) {
        throw new NotFoundException('Invoice not found');
      }
    }
  }
}
