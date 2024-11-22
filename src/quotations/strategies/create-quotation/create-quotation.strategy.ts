import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ICreateQuotationStrategy } from './create-quotation-strategy.interface';
import { CreateQuotationDto } from '@/quotations/dtos/CreateQuotationDto';
import { Quotation } from '@/quotations/models/quotations.model';
import { ForeignKeyConstraintError } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { QuotationStatus } from '@/shared/enums/quotation-status.enum';

@Injectable()
export class CreateQuotationStrategy implements ICreateQuotationStrategy {
  constructor(@InjectModel(Quotation) private quotationModel: typeof Quotation) { }

  async create(quotationInfo: CreateQuotationDto): Promise<Quotation> {

    // const quotation = new Quotation();
    // quotation.totalPrice = 0;
    // quotation.pickupDate = quotationInfo.pickupDate;
    // quotation.deliveryDate = quotationInfo.deliveryDate;
    // quotation.quotationDate = quotationInfo.quotationDate;
    // quotation.expiredDate = quotationInfo.expiredDate;
    // quotation.status = quotationInfo.status;
    // quotation.freightId = quotationInfo.freightId;
    // quotation.quoteReqId = quotationInfo.quoteReqId;
    // quotation.employeeId = quotationInfo.employeeId
    try {
      return await this.quotationModel.create({
        totalPrice: 0,
        pickupDate: quotationInfo.pickupDate,
        deliveryDate: quotationInfo.deliveryDate,
        quotationDate: quotationInfo.quotationDate,
        expiredDate: quotationInfo.expiredDate,
        status: QuotationStatus.DRAFT,
        freightId: quotationInfo.freightId,
        quoteReqId: quotationInfo.quoteReqId,
        employeeId: quotationInfo.employeeId
      })
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        throw new NotFoundException('Invalid foreign key')
      }
      if (error instanceof BadRequestException) {
        throw new BadRequestException('Error message: ', error.message)
      }

      throw Error()
    }
  }
}
