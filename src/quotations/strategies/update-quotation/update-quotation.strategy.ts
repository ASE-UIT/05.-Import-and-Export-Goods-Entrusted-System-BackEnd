import { CreateQuotationDto } from '@/quotations/dtos/CreateQuotationDto';
import { Quotation } from '@/quotations/models/quotations.model';
import { IUpdateQuotationStrategy } from './update-quotation-strategy.interface';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UniqueConstraintError } from 'sequelize';

@Injectable()
export class UpdateQuotationStrategy implements IUpdateQuotationStrategy {
  async update(
    quotationId: string,
    udpateInfo: Partial<CreateQuotationDto>,
  ): Promise<Quotation> {

    try {
      const [affetedRows, [updateData]] = await Quotation.update(
        { ...udpateInfo },
        { where: { id: quotationId }, returning: true },
      )
      return updateData.dataValues as Quotation
    } catch (error) {
      if (error instanceof TypeError) {
        throw new NotFoundException('Customer not found');
      }
      if (error instanceof UniqueConstraintError) {
        throw new ConflictException(error.errors[0].message);
      }
    }
    // const [affetedRows, [updateData]] = await Quotation.update(
    //   { ...udpateInfo },
    //   { where: { id: quotationId }, returning: true },
    // );
    // if (affetedRows === 0) {
    //   throw new BadRequestException("Quotation doesn't exist");
    // }
    // return updateData.dataValues as Quotation;
  }
}
