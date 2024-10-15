import { CreateQuotationDto } from '@/quotations/dtos/CreateQuotationDto';
import { Quotation } from '@/quotations/models/quotations.model';
import { IUpdateQuotationStrategy } from './update-quotation-strategy.interface';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class UpdateQuotationStrategy implements IUpdateQuotationStrategy {
  async update(
    quotationId: string,
    udpateInfo: Partial<CreateQuotationDto>,
  ): Promise<Quotation> {
    const [affetedRows, [updateData]] = await Quotation.update(
      { ...udpateInfo },
      { where: { id: quotationId }, returning: true },
    );
    if (affetedRows === 0) {
      throw new BadRequestException("Quotation doesn't exist");
    }
    return updateData.dataValues as Quotation;
  }
}
