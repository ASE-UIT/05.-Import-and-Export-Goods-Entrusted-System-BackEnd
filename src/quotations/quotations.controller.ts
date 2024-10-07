import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Quotation } from './models/quotations.model';
import { QuotationsService } from './quotations.service';
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
import {
  CreateQuotationDto,
  CreateQuotationSchema,
} from './dtos/CreateQuotationDto';
import {
  UpdateQuotationDto,
  UpdateQuotationSchema,
} from './dtos/UpdateQuotationDto';
import {
  QueryQuotationDto,
  QueryQuotationSchema,
} from './dtos/QueryQuotationDto';

@Controller({
  path: 'quotations',
  version: '1',
})
export class QuotationsController {
  constructor(private quotationService: QuotationsService) {}

  // Tạo quotatiom mới
  @Post()
  async createQuotaton(
    @Body(new ZodValidationPipe(CreateQuotationSchema))
    body: CreateQuotationDto,
  ) {
    await this.quotationService.create(body);
    return { message: `Quotation created` };
  }

  @Get()
  async getQuotations(
    @Query(new ZodValidationPipe(QueryQuotationSchema))
    query: QueryQuotationDto,
  ) {
    return this.quotationService.findQuotations(query);
  }

  // Cập nhật quotation theo id
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateQuotationSchema))
    body: UpdateQuotationDto,
  ) {
    const updateResponse = await this.quotationService.update(id, body);
    return updateResponse;
  }
}
