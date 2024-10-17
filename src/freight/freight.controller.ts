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

@Controller({
  path: 'freights',
  version: '1',
})
export class FreightController {
  constructor(private freightService: FreightService) {}

  @Get()
  async findFreight(
    @Query(new ZodValidationPipe(QueryFreightSchema)) query: QueryFreightDto,
  ): Promise<Freight[]> {
    if (Object.keys(query).length === 0)
      return this.freightService.find(
        FindFreightStrategy.ALL,
        '',
      );
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
        const freight = await this.freightService.find(strategy, value);
        if (freight.length > 0) {
          if (strategy === FindFreightStrategy.ALL || freight.length > 1)
            return freight;
          else return [freight[0]];
        }
      }
    }

    throw new NotFoundException('Freight not found');
  }

  @Post()
  async createFreight(
    @Body(new ZodValidationPipe(CreateFreightSchema)) body: CreateFreightDto,
  ): Promise<{message: string; data: Freight}> {
    const createRes = await this.freightService.create(body);
    return createRes;
  }

  @Patch(':id')
  async updateFreight(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(CreateFreightSchema.partial())) 
    body: Partial<CreateFreightDto>,
  ): Promise<{ message: string; data: Freight }> {
    if (Object.keys(body).length === 0)
      throw new BadRequestException('Body is empty');
    const updateResponse = await this.freightService.update(id, body);
    return updateResponse;
  }
}
