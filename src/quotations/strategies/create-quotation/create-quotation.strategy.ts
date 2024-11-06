import { Injectable } from '@nestjs/common';
import { ICreateQuotationStrategy } from './create-quotation-strategy.interface';
import { CreateQuotationDto } from '@/quotations/dtos/CreateQuotationDto';
import { Quotation } from '@/quotations/models/quotations.model';

@Injectable()
export class CreateQuotationStrategy implements ICreateQuotationStrategy {
  async create(quotationInfo: CreateQuotationDto): Promise<Quotation> {
    const quotation = new Quotation();
    quotation.totalPrice = quotationInfo.totalPrice;
    quotation.pickupDate = quotationInfo.pickupDate;
    quotation.deliveryDate = quotationInfo.deliveryDate;
    quotation.quotationDate = quotationInfo.quotationDate;
    quotation.expiredDate = quotationInfo.expiredDate;
    quotation.status = quotationInfo.status;
    quotation.freightId = quotationInfo.freightId;
    quotation.quoteReqId = quotationInfo.quoteReqId;
    quotation.employeeId = quotationInfo.employeeId
    await quotation.save();
    return quotation;
  }
}
