import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { QuotationReqsService } from './quotationReqs.service';
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
import { QueryQuotationReqDto, QueryQuotationReqSchema } from './dtos/QueryQuotationReqDto';
import { CreateQuotationReqDto, CreateQuotationReqSchema } from './dtos/CreateQuotationReqDto';
import { FindQuotationReqStrategy } from './strategies/find-quotationReq/find-quotationReq-strategy.enum';
import { UpdateQuotationReqDto, UpdateQuotationReqSchema } from './dtos/UpdateQuotationReqDto';
import { QuotationReq } from './models/quotationReq.model';

@Controller({
  path: 'quotationReqs',
  version: '1',
})
export class QuotationReqsController {
  constructor(private readonly quotationReqsService: QuotationReqsService) { }

  @Get()
  async getQuotationReqs(
    @Query(new ZodValidationPipe(QueryQuotationReqSchema)) query: QueryQuotationReqDto,
  ) {

    // Get query fields
    const queryFields: { [key: string]: FindQuotationReqStrategy } = {
      all: FindQuotationReqStrategy.ALL,
      requestDate: FindQuotationReqStrategy.REQUESTDATE,
      status: FindQuotationReqStrategy.STATUS,
      customerId: FindQuotationReqStrategy.CUSTOMERID
    }

    // Assign corrisponding strategy to query fields
    for (const [key, strategy] of Object.entries(queryFields)) {
      const value = query[key as keyof QueryQuotationReqDto];
      if (value) {
        const quotationReq = await this.quotationReqsService.findQuotationReq(
          strategy,
          value,
        );
        if (quotationReq.length > 0) {
          if (strategy === FindQuotationReqStrategy.ALL || quotationReq.length > 1)
            return quotationReq;
          else return quotationReq[0];
        }
      }
    }
  }

  //create quotation request
  @Post()
  async createQuotationReq(
    @Body(new ZodValidationPipe(CreateQuotationReqSchema)) body: CreateQuotationReqDto
  ) {
    await this.quotationReqsService.createQuotationReq(body)
    return { message: 'Quotation Request Created' }
  }
  //update quotation request
  @Put(':id')
  async updateQuotationReq(
    @Param('id') id: string, @Body(new ZodValidationPipe(UpdateQuotationReqSchema)) body: UpdateQuotationReqDto) {
    await this.quotationReqsService.updateQuotationReq(id, body)
    return { message: 'Quotation Request Updated' }
  }
}
