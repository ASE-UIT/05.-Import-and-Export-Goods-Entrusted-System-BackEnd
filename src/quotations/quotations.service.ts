import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Quotation } from './models/quotations.model';
import { CreateQuotationDto } from './dtos/CreateQuotationDto';
import { FindQuotationByStatus } from './strategies/find-quotation/find-by-status';
import { FindQuotationByDeliveryDate } from './strategies/find-quotation/find-by-delivery-date';
import { FindQuotationByExpiredDate } from './strategies/find-quotation/find-by-expired-date';
import { FindQuotationByPickupDate } from './strategies/find-quotation/find-by-pickup-date';
import { FindQuotationByQuotationDate } from './strategies/find-quotation/find-by-quotation-date';
import { FindQuotationByTotalPrice } from './strategies/find-quotation/find-by-total-price';
import { FindAllQuotationStrategy } from './strategies/find-quotation/find-all.strategy';
import { FindQuotationStrategy } from './strategies/find-quotation/find-quotation-strategy.enum';
import { IFindQuotationStrategy } from './strategies/find-quotation/find-quotation-strategy.interface';
import { CreateQuotationStrategy } from './strategies/create-quotation/create-quotation.strategy';
import { UpdateQuotationStrategy } from './strategies/update-quotation/update-quotation.strategy';
import { FindQuotationByEmployeeId } from './strategies/find-quotation/find-by-employee-id';

@Injectable()
export class QuotationsService {
  constructor(
    private findAllQuotationStrategy: FindAllQuotationStrategy,
    private findQuotationByPickupDate: FindQuotationByPickupDate,
    private findQuotationByStatus: FindQuotationByStatus,
    private findQuotationByDeliveryDate: FindQuotationByDeliveryDate,
    private findQuotationByExpiredDate: FindQuotationByExpiredDate,
    private findQuotationByQuotationDate: FindQuotationByQuotationDate,
    private findQuotationByTotalPrice: FindQuotationByTotalPrice,
    private findQuotationByEmployeeId: FindQuotationByEmployeeId,
    private createQuotationStrategy: CreateQuotationStrategy,
    private updateQuotationStrategy: UpdateQuotationStrategy,
  ) { }

  async create(
    quotationInfo: CreateQuotationDto,
  ): Promise<{ message: string; data: Quotation }> {
    const createdQuotation =
      await this.createQuotationStrategy.create(quotationInfo);
    return { message: 'Quotation created', data: createdQuotation };
  }

  find(
    strategy: FindQuotationStrategy,
    quotationInfo: any,
  ): Promise<Quotation[] | null> {
    const findStrategy = this.getFindStrategy(strategy);
    const quotation = findStrategy.find(quotationInfo);
    return quotation;
  }

  getFindStrategy(strategy: FindQuotationStrategy): IFindQuotationStrategy {
    switch (strategy) {
      case FindQuotationStrategy.ALL:
        return this.findAllQuotationStrategy;
      case FindQuotationStrategy.DELIVERY_DATE:
        return this.findQuotationByDeliveryDate;
      case FindQuotationStrategy.EXPIRED_DATE:
        return this.findQuotationByExpiredDate;
      case FindQuotationStrategy.PICKUP_DATE:
        return this.findQuotationByPickupDate;
      case FindQuotationStrategy.QUOTATION_DATE:
        return this.findQuotationByQuotationDate;
      case FindQuotationStrategy.STATUS:
        return this.findQuotationByStatus;
      case FindQuotationStrategy.TOTAL_PRICE:
        return this.findQuotationByTotalPrice;
      case FindQuotationStrategy.EMPLOYEE_ID:
        return this.findQuotationByEmployeeId;
    }
  }

  async update(
    quotationID: string,
    updateInfo: Partial<CreateQuotationDto>,
  ): Promise<{ message: string; data: Quotation }> {
    if (Object.keys(updateInfo).length < 1) {
      throw new BadRequestException('Body is empty');
    }
    const updatedResponse = await this.updateQuotationStrategy.update(
      quotationID,
      updateInfo,
    );
    return { message: 'Quotation updated', data: updatedResponse };
  }
}
