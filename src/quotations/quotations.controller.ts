import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { Quotation } from './models/quotations.model';
import { QuotationsService } from './quotations.service';

@Controller('quotations')
export class QuotationsController {
  constructor(private quotationService: QuotationsService) {}
  @Get()
  findAll(): Promise<Quotation[]> {
    return this.quotationService.findAll();
  }

  @Get()
  findOne(@Param() params): Promise<Quotation> {
    return this.quotationService.findOne(params.id);
  }

  @Post()
  create(@Body() quotation): Promise<Quotation> {
    return this.quotationService.create(quotation);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() quotation: Quotation,
  ): Promise<[number, Quotation[]]> {
    return this.quotationService.update(id, quotation);
  }
}
