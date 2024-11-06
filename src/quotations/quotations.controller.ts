import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
import {
  CreateQuotationDto,
  CreateQuotationSchema,
} from './dtos/CreateQuotationDto';
import {
  QueryQuotationDto,
  QueryQuotationSchema,
} from './dtos/QueryQuotationDto';
import { QuotationsService } from './quotations.service';
import { Quotation } from './models/quotations.model';
import { FindQuotationStrategy } from './strategies/find-quotation/find-quotation-strategy.enum';

@Controller({
  path: 'quotations',
  version: '1',
})
export class QuotationsController {
  constructor(private quotationsService: QuotationsService) {}

  @Post()
  async createQuotation(
    @Body(new ZodValidationPipe(CreateQuotationSchema))
    body: CreateQuotationDto,
  ): Promise<{ message: string; data: Quotation }> {
    const createRes = await this.quotationsService.create(body);
    return createRes;
  }

  @Get()
  async findQuotation(
    @Query(new ZodValidationPipe(QueryQuotationSchema))
    query: QueryQuotationDto,
  ): Promise<Quotation[]> {
    if (Object.keys(query).length === 0) {
      return this.quotationsService.find(FindQuotationStrategy.ALL, '');
    }
    const queryFields: { [key: string]: FindQuotationStrategy } = {
      deliveryDate: FindQuotationStrategy.DELIVERY_DATE,
      expiredDate: FindQuotationStrategy.EXPIRED_DATE,
      pickupDate: FindQuotationStrategy.PICKUP_DATE,
      quotationDate: FindQuotationStrategy.QUOTATION_DATE,
      status: FindQuotationStrategy.STATUS,
      totalPrice: FindQuotationStrategy.TOTAL_PRICE,
    };

    for (const [key, strategy] of Object.entries(queryFields)) {
      const value = query[key as keyof QueryQuotationDto];
      if (value) {
        const quotation = await this.quotationsService.find(strategy, value);

        if (quotation.length > 0) {
          if (strategy === FindQuotationStrategy.ALL || quotation.length > 1)
            return quotation;
          else return [quotation[0]];
        }
      }
    }

    throw new NotFoundException('Quotation not found');
  }

  @Patch(':id')
  async updateQuotation(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(CreateQuotationSchema.partial()))
    body: Partial<CreateQuotationDto>,
  ): Promise<{ message: string; data: Quotation }> {
    const updateRes = await this.quotationsService.update(id, body);
    return updateRes;
  }
}
