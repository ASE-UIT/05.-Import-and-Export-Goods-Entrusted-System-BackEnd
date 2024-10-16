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
import { SeaFreightService } from './seafreight.service';
import { FindSeaFreightStrategy } from './strategies/find-sea-freight/find-sea-freight-strategy.enum';
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
import { QuerySeaFreightDto, QuerySeaFreightSchema } from './dtos/QuerySeaFreightDto';
import {
  CreateSeaFreightDto,
  CreateSeaFreightSchema,
} from './dtos/CreateSeaFreightDto';

@Controller({
  path: 'seafreight',
  version: '1',
})
export class SeaFreightController {
  constructor(private seaFreightService: SeaFreightService) {} 

  @Get()
  async getSeaFreight(
    @Query(new ZodValidationPipe(QuerySeaFreightSchema)) query: QuerySeaFreightDto,
  ) {
    if (Object.keys(query).length === 0)
      return await this.seaFreightService.findSeaFreight( 
        FindSeaFreightStrategy.ALL,
        '',
      );
    const queryFields: { [key: string]: FindSeaFreightStrategy } = {
      all: FindSeaFreightStrategy.ALL,
      price20dc: FindSeaFreightStrategy.PRICE_20DC,
      price20rf: FindSeaFreightStrategy.PRICE_20RF,
      price40dc: FindSeaFreightStrategy.PRICE_40DC,
      price40hc: FindSeaFreightStrategy.PRICE_40HC,
      price40rf: FindSeaFreightStrategy.PRICE_40RF,
      provider_id: FindSeaFreightStrategy.FREIGHT_ID,
    };

    for (const [key, strategy] of Object.entries(queryFields)) {
      const value = query[key as keyof QuerySeaFreightDto];
      if (value) {
        const seaFreight = await this.seaFreightService.findSeaFreight(strategy, value.toString());
        if (seaFreight.length > 0) {
          if (strategy === FindSeaFreightStrategy.ALL || seaFreight.length > 1)
            return seaFreight;
          else return seaFreight[0];
        }
      }
    }

    throw new NotFoundException('Sea Freight not found');
  }

  @Post()
  async createSeaFreight(
    @Body(new ZodValidationPipe(CreateSeaFreightSchema)) body: CreateSeaFreightDto,
  ) {
    const createRes = await this.seaFreightService.createSeaFreight(body); 
    return { message: `Sea Freight created`, data: createRes }; 
  }

  @Patch(':id')
  async updateSeaFreight(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(CreateSeaFreightSchema.partial())) 
    body: Partial<CreateSeaFreightDto>,
  ) {
    if (Object.keys(body).length === 0)
      throw new BadRequestException('Body is empty');
    const updateResponse = await this.seaFreightService.updateSeaFreight(id, body);
  }
}
