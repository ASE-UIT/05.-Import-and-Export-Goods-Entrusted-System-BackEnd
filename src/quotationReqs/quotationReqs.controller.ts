import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
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
    if (Object.keys(query).length === 0) {
      return await this.quotationReqsService.findQuotationReq(
        FindQuotationReqStrategy.ALL,
        ''
      )
    }
    // Get query fields
    const queryFields: { [key: string]: FindQuotationReqStrategy } = {
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
    const quoteReq = await this.quotationReqsService.createQuotationReq(body)
    return { message: 'Quotate request created', data: quoteReq }
  }
  //update quotation request
  @Patch(':id')
  async updateQuotationReq(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(CreateQuotationReqSchema.partial())) body: Partial<CreateQuotationReqDto>
  ) {
    //check if body is empty 
    if (Object.keys(body).length === 0) {
      throw new BadRequestException('Body cannot be empty')
    }
    const updatedResponse = await this.quotationReqsService.updateQuotationReq(id, body)
    return { message: "Quote Request updated successfully", data: updatedResponse }
  }
}
