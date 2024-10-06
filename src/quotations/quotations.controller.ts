import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
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

  // Lấy quotation
  @Get()
  findAll(): Promise<Quotation[]> {
    return this.quotationService.findAll();
  }

  @Get('totalPrice/:totalPrice')
  getQuotationByTotalPrice(
    @Param('totalPrice') totalPrice: number,
  ): Promise<Quotation> {
    return this.quotationService.getQuotationByTotalPrice(totalPrice);
  }

  @Get('deliveryDate/:deliveryDate')
  getQuotationByDeliveryDate(
    @Param('deliveryDate') deliveryDate: string,
  ): Promise<Quotation> {
    return this.quotationService.getQuotationByDeliveryDate(deliveryDate);
  }

  @Get('pickupDate/:pickupDate')
  getQuotationByPickupDate(
    @Param('pickupDate') pickupDate: string,
  ): Promise<Quotation> {
    return this.quotationService.getQuotationByPickupDate(pickupDate);
  }

  @Get('quotationDate/:quotationDate')
  getQuotationByQuotationDate(
    @Param('quotationDate') quotationDate: string,
  ): Promise<Quotation> {
    return this.quotationService.getQuotationByQuotationDate(quotationDate);
  }

  @Get('expiredDate/:expiredDate')
  getQuotationByExpiredDate(
    @Param('expiredDate') expiredDate: string,
  ): Promise<Quotation> {
    return this.quotationService.getQuotationByExpiredDate(expiredDate);
  }

  // Cập nhật quotation theo id
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateQuotationSchema))
    body: UpdateQuotationDto,
  ) {
    await this.quotationService.update(id, body);
    return { message: `Quotation with ID ${id} was updated` };
  }
}
