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
import { FreightService } from './freight.service';
import { FindFreightStrategy } from './strategies/find-freight/find-freight-strategy.enum';
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
import { QueryFreightDto, QueryFreightSchema } from './dtos/QueryFreightDto';
import {
  CreateFreightDto,
  CreateFreightSchema,
} from './dtos/CreateFreightDto';
import { Freight } from './models/freight.model';
import { UpdateFreightDto, UpdateFreightSchema } from './dtos/UpdateFreightDto';

@Controller({
  path: 'freights',
  version: '1',
})
export class FreightController {
  constructor(private freightService: FreightService) {}

  @Get()
  async findFreight(
    @Query(new ZodValidationPipe(QueryFreightSchema)) query: QueryFreightDto,
  ): Promise<{ message: string; data: Freight[] }> {
    if (Object.keys(query).length === 0) {
      const data = await this.freightService.find(
        FindFreightStrategy.ALL,
        '',
      );
      return { message: 'All freights retrieved successfully', data };
    }

    const queryFields: { [key: string]: FindFreightStrategy } = {
      all: FindFreightStrategy.ALL,
      destination: FindFreightStrategy.DESTINATION,
      origin: FindFreightStrategy.ORIGIN,
      transit: FindFreightStrategy.TRANSIT,
      transit_time: FindFreightStrategy.TRANSIT_TIME,
      freight_type: FindFreightStrategy.FREIGHT_TYPE,
      valid_from: FindFreightStrategy.VALID_FROM,
      valid_until: FindFreightStrategy.VALID_UNTIL,
    };

    for (const [key, strategy] of Object.entries(queryFields)) {
      const value = query[key as keyof QueryFreightDto];
      if (value) {
        const data = await this.freightService.find(strategy, value);
        if (data.length > 0) {
          return { message: 'Freight(s) found', data };
        }
      }
    }

    throw new NotFoundException('Freight not found');
  }

  @Post()
  async createFreight(
    @Body(new ZodValidationPipe(CreateFreightSchema)) body: CreateFreightDto,
  ): Promise<{ message: string; data: Freight }> {
    const data = await this.freightService.create(body);
    return { message: 'Freight created successfully', data };
  }

  @Patch(':id')
  async updateFreight(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateFreightSchema)) body: UpdateFreightDto,
  ): Promise<{ message: string; data: Freight }> {
    if (Object.keys(body).length === 0) {
      throw new BadRequestException('Body is empty');
    }
    const data = await this.freightService.update(id, body);
    return { message: 'Freight updated successfully', data };
  }
}
