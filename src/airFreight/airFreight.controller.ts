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
import { AirFreightService } from './airFreight.service'; 
import { FindAirFreightStrategy } from './strategies/find-air-freight/find-air-freight-strategy.enum';
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
import { QueryAirFreightDto, QueryAirFreightSchema } from './dtos/QueryAirFreightDto';
import {
  CreateAirFreightDto,
  CreateAirFreightSchema,
} from './dtos/CreateAirFreightDto';
import { AirFreight } from './models/airFreight.model';

@Controller({
  path: 'airFreight',
  version: '1',
})
export class AirFreightController {
  constructor(private airFreightService: AirFreightService) {} 

  @Get()
  async findAirFreight(
    @Query(new ZodValidationPipe(QueryAirFreightSchema)) query: QueryAirFreightDto,
  ): Promise<AirFreight[]> {
    if (Object.keys(query).length === 0)
      return this.airFreightService.find( 
        FindAirFreightStrategy.ALL,
        '',
      );

    const queryFields: { [key: string]: FindAirFreightStrategy } = {
      all: FindAirFreightStrategy.ALL,
      price_45k: FindAirFreightStrategy.PRICE_45K,
      price_100k: FindAirFreightStrategy.PRICE_100K,
      price_300k: FindAirFreightStrategy.PRICE_300K,
      price_500k: FindAirFreightStrategy.PRICE_500K,
      fsc: FindAirFreightStrategy.FSC,
      ams_Fees: FindAirFreightStrategy.AMS_FEES,
      scc: FindAirFreightStrategy.SCC,
      routine: FindAirFreightStrategy.ROUTINE,
    };

    for (const [key, strategy] of Object.entries(queryFields)) {
      const value = query[key as keyof QueryAirFreightDto];
      if (value) {
        const airFreight = await this.airFreightService.find(strategy, value);
        if (airFreight.length > 0) {
          if (strategy === FindAirFreightStrategy.ALL || airFreight.length > 1)
            return airFreight;
          else return [airFreight[0]];
        }
      }
    }

    throw new NotFoundException('Air Freight not found');
  }

  @Post()
  async createAirFreight(
    @Body(new ZodValidationPipe(CreateAirFreightSchema)) body: CreateAirFreightDto,
  ): Promise<{ message: string; data: AirFreight }> {
    const createRes = await this.airFreightService.create(body); 
    return createRes; 
  }

  @Patch(':id')
  async updateAirFreight(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(CreateAirFreightSchema.partial())) 
    body: Partial<CreateAirFreightDto>,
  ): Promise<{ message: string; data: AirFreight }> {
    if (Object.keys(body).length === 0)
      throw new BadRequestException('Body is empty');
      
    const updateResponse = await this.airFreightService.update(id, body);
    return updateResponse; 
  }
}
