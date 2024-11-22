import { Invoice } from '@/invoices/models/invoice.model';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class UpdatePaidAmountInvoiceStrategy {
  constructor(
    @InjectModel(Invoice)
    private invoiceModel: typeof Invoice,
  ) {}
  async update(invoiceId: string, invoicePaidAmount: number): Promise<Invoice> {
    try {
      const [affetedRows, [updateData]] = await this.invoiceModel.update(
        { paidAmount: invoicePaidAmount },
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
