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

@Controller({
  path: 'freight',
  version: '1',
})
export class FreightController {
  constructor(private freightService: FreightService) {}

  @Get()
  async getFreight(
    @Query(new ZodValidationPipe(QueryFreightSchema)) query: QueryFreightDto,
  ) {
    if (Object.keys(query).length === 0)
      return await this.freightService.findFreight(
        FindFreightStrategy.ALL,
        '',
      );
    const queryFields: { [key: string]: FindFreightStrategy } = {
      all: FindFreightStrategy.ALL,
      destination: FindFreightStrategy.DESTINATION,
      origin: FindFreightStrategy.ORIGIN,
      provider_id: FindFreightStrategy.PROVIDER_ID,
      transit: FindFreightStrategy.TRANSIT,
      transit_time: FindFreightStrategy.TRANSIT_TIME,
      freight_type: FindFreightStrategy.FREIGHT_TYPE,
      valid_from: FindFreightStrategy.VALID_FROM,
      valid_until: FindFreightStrategy.VALID_UNTIL,
    };

    for (const [key, strategy] of Object.entries(queryFields)) {
      const value = query[key as keyof QueryFreightDto];
      if (value) {
        const freight = await this.freightService.findFreight(strategy, value.toString());
        if (freight.length > 0) {
          if (strategy === FindFreightStrategy.ALL || freight.length > 1)
            return freight;
          else return freight[0];
        }
      }
    }

    throw new NotFoundException('Freight not found');
  }

  @Post()
  async createFreight(
    @Body(new ZodValidationPipe(CreateFreightSchema)) body: CreateFreightDto,
  ) {
    const createRes = await this.freightService.createFreight(body);
    return { message: `Freight created`, data: createRes };
  }

  @Patch(':id')
  async updateFreight(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(CreateFreightSchema.partial())) 
    body: Partial<CreateFreightDto>,
  ) {
    if (Object.keys(body).length === 0)
      throw new BadRequestException('Body is empty');
    const updateResponse = await this.freightService.updateFreight(id, body);
    return updateResponse;
  }
}
