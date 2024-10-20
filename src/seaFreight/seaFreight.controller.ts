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
import { SeaFreightService } from './seaFreight.service';
import { FindSeaFreightStrategy } from './strategies/find-sea-freight/find-sea-freight-strategy.enum';
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
import {
  CreateSeaFreightDto,
  CreateSeaFreightSchema,
} from './dtos/CreateSeaFreightDto';
import { SeaFreight } from './models/seaFreight.model';
@Controller({
  path: 'sea-freight',
  version: '1',
})
export class SeaFreightController {
  constructor(private seaFreightService: SeaFreightService) { }

  @Get()
  async findSeaFreight(
    @Query(new ZodValidationPipe(CreateSeaFreightSchema.partial())) query: Partial<CreateSeaFreightDto>,
  ): Promise<{ message: string; data: SeaFreight[] }> {
    if (Object.keys(query).length === 0) {
      const data = await this.seaFreightService.find(FindSeaFreightStrategy.ALL, '');
      return { message: 'All sea freights fetched', data };
    }

    const queryFields: { [key: string]: FindSeaFreightStrategy } = {
      all: FindSeaFreightStrategy.ALL,
      price20dc: FindSeaFreightStrategy.PRICE_20DC,
      price20rf: FindSeaFreightStrategy.PRICE_20RF,
      price40dc: FindSeaFreightStrategy.PRICE_40DC,
      price40hc: FindSeaFreightStrategy.PRICE_40HC,
      price40rf: FindSeaFreightStrategy.PRICE_40RF,
    };

    for (const [key, strategy] of Object.entries(queryFields)) {
      const value = query[key as keyof CreateSeaFreightDto];
      if (value) {
        const data = await this.seaFreightService.find(strategy, value);
        if (data.length > 0) {
          return { message: 'Sea freights fetched', data };
        }
      }
    }

    throw new NotFoundException('Sea Freight not found');
  }

  @Post()
  async createSeaFreight(
    @Body(new ZodValidationPipe(CreateSeaFreightSchema)) body: CreateSeaFreightDto,
  ): Promise<{ message: string; data: SeaFreight }> {
    const data = await this.seaFreightService.create(body);
    return { message: 'Sea freight created', data };
  }

  @Patch(':id')
  async updateSeaFreight(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(CreateSeaFreightSchema.partial())) body: Partial<CreateSeaFreightDto>,
  ): Promise<{ message: string; data: SeaFreight }> {
    if (Object.keys(body).length === 0) {
      throw new BadRequestException('Body is empty');
    }
    const data = await this.seaFreightService.update(id, body);
    return { message: 'Sea freight updated', data };
  }
}
