import { BadRequestException, Injectable } from '@nestjs/common';
import { IUpdateInvoiceStrategy } from './update-invoice-strategy.interface';
import { CreateInvoiceDto } from '@/invoices/dtos/CreateInvoiceDto';
import { Invoice } from '@/invoices/models/invoice.model';

@Injectable()
export class UpdateInvoiceStrategy implements IUpdateInvoiceStrategy {
  async update(
    invoiceId: string,
    udpateInfo: Partial<CreateInvoiceDto>,
  ): Promise<Invoice> {
    const [affetedRows, [updateData]] = await Invoice.update(
      { ...udpateInfo },
      { where: { id: invoiceId }, returning: true },
    );
    if (affetedRows === 0) {
      throw new BadRequestException("Invoice doesn't exist");
    }
    return updateData.dataValues as Invoice;
  }
}
