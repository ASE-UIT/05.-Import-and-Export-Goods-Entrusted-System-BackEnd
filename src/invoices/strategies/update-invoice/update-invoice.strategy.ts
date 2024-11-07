import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IUpdateInvoiceStrategy } from './update-invoice-strategy.interface';
import { CreateInvoiceDto } from '@/invoices/dtos/create-invoice.dto';
import { Invoice } from '@/invoices/models/invoice.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class UpdateInvoiceStrategy implements IUpdateInvoiceStrategy {
  constructor(
    @InjectModel(Invoice)
    private invoiceModel: typeof Invoice,
  ) {}
  async update(
    invoiceId: string,
    udpateInfo: Partial<CreateInvoiceDto>,
  ): Promise<Invoice> {
    try {
      const [affetedRows, [updateData]] = await this.invoiceModel.update(
        { ...udpateInfo },
        { where: { id: invoiceId }, returning: true },
      );
      return updateData.dataValues as Invoice;
    } catch (err) {
      if (err instanceof TypeError) {
        throw new NotFoundException('Invoice not found');
      }
    }
  }
}
