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
import { LandFreightService } from './landFreight.service';
import { FindLandFreightStrategy } from './strategies/find-land-freight/find-land-freight-strategy.enum';
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
import { CreateLandFreightDto, CreateLandFreightSchema } from './dtos/CreateLandFreightDto';
import { LandFreight } from './models/landFreight.model';

@Controller({
  path: 'land-freight',
  version: '1',
})
export class LandFreightController {
  constructor(private landFreightService: LandFreightService) { }

  @Get()
  async findLandFreight(
    @Query(new ZodValidationPipe(CreateLandFreightSchema.partial())) query: Partial<CreateLandFreightDto>, // Reuse the create schema with .partial()
  ): Promise<{ message: string; data: LandFreight[] }> { // Return message and data
    if (Object.keys(query).length === 0) {
      const data = await this.landFreightService.find(FindLandFreightStrategy.ALL, '');
      return { message: 'All land freights fetched', data };
    }

    const queryFields: { [key: string]: FindLandFreightStrategy } = {
      all: FindLandFreightStrategy.ALL,
      price_100_200: FindLandFreightStrategy.PRICE_100_200,
      price_200_500: FindLandFreightStrategy.PRICE_200_500,
      price_500_1500: FindLandFreightStrategy.PRICE_500_1500,
      price_1500_5000: FindLandFreightStrategy.PRICE_1500_5000,
      price_5000_10000: FindLandFreightStrategy.PRICE_5000_10000,
      price_10000: FindLandFreightStrategy.PRICE_10000,
    };

    for (const [key, strategy] of Object.entries(queryFields)) {
      const value = query[key as keyof CreateLandFreightDto];
      if (value) {
        const data = await this.landFreightService.find(strategy, value);
        if (data.length > 0) {
          return { message: 'Land freights fetched', data };
        }
      }
    }

    throw new NotFoundException('Land Freight not found');
  }

  @Post()
  async createLandFreight(
    @Body(new ZodValidationPipe(CreateLandFreightSchema)) body: CreateLandFreightDto,
  ): Promise<{ message: string; data: LandFreight }> {
    const data = await this.landFreightService.create(body);
    return { message: 'Land freight created', data };
  }

  @Patch(':id')
  async updateLandFreight(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(CreateLandFreightSchema.partial())) body: Partial<CreateLandFreightDto>,
  ): Promise<{ message: string; data: LandFreight }> {
    if (Object.keys(body).length === 0) {
      throw new BadRequestException('Body is empty');
    }
    const data = await this.landFreightService.update(id, body);
    return { message: 'Land freight updated', data };
  }
}
