import { Injectable } from '@nestjs/common';
import { CreateQuotationReqDto } from './dtos/CreateQuotationReqDto';
import { CreateQuotationReqStrategy } from './strategies/create-quotationReq/create-quotationReq.strategy';
import { FindQuotationReqStrategy } from './strategies/find-quotationReq/find-quotationReq-strategy.enum';
import { QuotationReq } from './models/quotationReq.model';
import { IFindQuotationReqStrategy } from './strategies/find-quotationReq/find-quotationReq-strategy.interface';
import { FindAllQuotationReqStrategy } from './strategies/find-quotationReq/find-all.strategy';
import { FindQuotationReqByRequestDateStrategy } from './strategies/find-quotationReq/find-by-requestDate.strategy';
import { FindQuotationReqByStatusStrategy } from './strategies/find-quotationReq/find-by-status.strategy';
import { FindQuotationReqByCustomerIdStrategy } from './strategies/find-quotationReq/find-by-customerId.strategy';
import { UpdateQuotationReqDto } from './dtos/UpdateQuotationReqDto';
import { UpdateQuotationReqStrategy } from './strategies/update-quotationReq/update-quotationReq.strategy';

@Injectable()
export class QuotationReqsService {
  constructor(
    private createQuotationReqStrategy: CreateQuotationReqStrategy,
    private updateQuotationReqStrategy: UpdateQuotationReqStrategy,
    private findAllQuotationReqStratygy: FindAllQuotationReqStrategy,
    private findQuotationReqByRequestDateStrategy: FindQuotationReqByRequestDateStrategy,
    private findQuotationReqByStatus: FindQuotationReqByStatusStrategy,
    private findQuotationReqByCustomerId: FindQuotationReqByCustomerIdStrategy,
  ) { }

  // finding services
  async findQuotationReq(
    strategy: FindQuotationReqStrategy,
    quotationReqInfo: string,
  ): Promise<QuotationReq[] | null> {
    const findStrategy = this.getFindStrategy(strategy)
    const quotationReq: QuotationReq[] | null = await findStrategy.find(quotationReqInfo)
    return quotationReq
  }

  getFindStrategy(strategy: FindQuotationReqStrategy): IFindQuotationReqStrategy {
    switch (strategy) {
      case FindQuotationReqStrategy.ALL:
        return this.findAllQuotationReqStratygy
      case FindQuotationReqStrategy.REQUESTDATE:
        return this.findQuotationReqByRequestDateStrategy
      case FindQuotationReqStrategy.STATUS:
        return this.findQuotationReqByStatus
      case FindQuotationReqStrategy.CUSTOMERID:
        return this.findQuotationReqByCustomerId
    }
  }

  async createQuotationReq(quotationReqInfo: CreateQuotationReqDto): Promise<void> {
    try {
      return await this.createQuotationReqStrategy.create(quotationReqInfo)
    } catch (error) {
      throw new Error('Error when create quotation request')
    }
  }

  async updateQuotationReq(id: string, quotationReqInfo: UpdateQuotationReqDto): Promise<void> {
    try {
      return await this.updateQuotationReqStrategy.update(id, quotationReqInfo)
    } catch (error) {
      throw new Error('Error when create quotation request')
    }
  }
}
