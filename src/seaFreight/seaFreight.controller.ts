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
import { QuerySeaFreightDto, QuerySeaFreightSchema } from './dtos/QuerySeaFreightDto';
import {
  CreateSeaFreightDto,
  CreateSeaFreightSchema,
} from './dtos/CreateSeaFreightDto';
import { SeaFreight } from './models/seaFreight.model';

@Controller({
  path: 'seaFreight',
  version: '1',
})
export class SeaFreightController {
  constructor(private seaFreightService: SeaFreightService) {} 

  @Get()
  async findSeaFreight(
    @Query(new ZodValidationPipe(QuerySeaFreightSchema)) query: QuerySeaFreightDto,
  ): Promise<SeaFreight[]> {
    if (Object.keys(query).length === 0)
      return this.seaFreightService.find( 
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
    };

    for (const [key, strategy] of Object.entries(queryFields)) {
      const value = query[key as keyof QuerySeaFreightDto];
      if (value) {
        const seaFreight = await this.seaFreightService.find(strategy, value);
        if (seaFreight.length > 0) {
          if (strategy === FindSeaFreightStrategy.ALL || seaFreight.length > 1)
            return seaFreight;
          else return [seaFreight[0]];
        }
      }
    }

    throw new NotFoundException('Sea Freight not found');
  }

  @Post()
  async createSeaFreight(
    @Body(new ZodValidationPipe(CreateSeaFreightSchema)) body: CreateSeaFreightDto,
  ): Promise<{ message: string; data: SeaFreight }>  {
    const createRes = await this.seaFreightService.create(body); 
    return createRes; 
  }

  @Patch(':id')
  async updateSeaFreight(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(CreateSeaFreightSchema.partial())) 
    body: Partial<CreateSeaFreightDto>,
   ): Promise<{ message: string; data: SeaFreight }> {
    const updateRes = await this.seaFreightService.update(id, body);
    return updateRes;
  }
}
