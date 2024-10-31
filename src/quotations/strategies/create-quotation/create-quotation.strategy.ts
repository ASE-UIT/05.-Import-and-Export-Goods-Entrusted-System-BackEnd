import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ICreateQuotationStrategy } from './create-quotation-strategy.interface';
import { CreateQuotationDto } from '@/quotations/dtos/CreateQuotationDto';
import { Quotation } from '@/quotations/models/quotations.model';
import { ForeignKeyConstraintError } from 'sequelize';

@Injectable()
export class CreateQuotationStrategy implements ICreateQuotationStrategy {
  async create(quotationInfo: CreateQuotationDto): Promise<Quotation> {
    const quotation = new Quotation();
    quotation.totalPrice = 0;
    quotation.pickupDate = quotationInfo.pickupDate;
    quotation.deliveryDate = quotationInfo.deliveryDate;
    quotation.quotationDate = quotationInfo.quotationDate;
    quotation.expiredDate = quotationInfo.expiredDate;
    quotation.status = quotationInfo.status;
    quotation.freightId = quotationInfo.freightId;
    quotation.quoteReqId = quotationInfo.quoteReqId;
    quotation.employeeId = quotationInfo.employeeId
    try {
      await quotation.save()
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException('Error message: ', error.message)
      }
      if (error instanceof ForeignKeyConstraintError) {
        throw new NotFoundException('Invalid foreign key')
      }
      throw Error()
    }
    return quotation;
  }
}
