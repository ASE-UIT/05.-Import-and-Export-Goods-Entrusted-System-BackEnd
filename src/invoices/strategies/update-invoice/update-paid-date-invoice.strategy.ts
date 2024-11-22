import { Invoice } from '@/invoices/models/invoice.model';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class UpdatePaidDateInvoiceStrategy {
  constructor(
    @InjectModel(Invoice)
    private invoiceModel: typeof Invoice,
  ) {}
  async update(invoiceId: string, invoicePaidDate: Date): Promise<Invoice> {
    try {
      const [affetedRows, [updateData]] = await this.invoiceModel.update(
        { paidDate: invoicePaidDate },
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
