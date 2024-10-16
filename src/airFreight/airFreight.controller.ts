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
import { AirFreightService } from './airfreight.service'; 
import { FindAirFreightStrategy } from './strategies/find-air-freight/find-air-freight-strategy.enum';
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
import { QueryAirFreightDto, QueryAirFreightSchema } from './dtos/QueryAirFreightDto';
import {
  CreateAirFreightDto,
  CreateAirFreightSchema,
} from './dtos/CreateAirFreightDto';

@Controller({
  path: 'airfreight',
  version: '1',
})
export class AirFreightController {
  constructor(private airFreightService: AirFreightService) {} 

  @Get()
  async getAirFreight(
    @Query(new ZodValidationPipe(QueryAirFreightSchema)) query: QueryAirFreightDto,
  ) {
    if (Object.keys(query).length === 0)
      return await this.airFreightService.findAirFreight( 
        FindAirFreightStrategy.ALL,
        '',
      );

    const queryFields: { [key: string]: FindAirFreightStrategy } = {
      all: FindAirFreightStrategy.ALL,
      price45k: FindAirFreightStrategy.PRICE_45K,
      price100k: FindAirFreightStrategy.PRICE_100K,
      price300k: FindAirFreightStrategy.PRICE_300K,
      price500k: FindAirFreightStrategy.PRICE_500K,
      fsc: FindAirFreightStrategy.FSC,
      amsFees: FindAirFreightStrategy.AMS_FEES,
      scc: FindAirFreightStrategy.SCC,
      routine: FindAirFreightStrategy.ROUTINE,
      freight_id: FindAirFreightStrategy.FREIGHT_ID,
    };

    for (const [key, strategy] of Object.entries(queryFields)) {
      const value = query[key as keyof QueryAirFreightDto];
      if (value) {
        const airFreight = await this.airFreightService.findAirFreight(strategy, value.toString());
        if (airFreight.length > 0) {
          if (strategy === FindAirFreightStrategy.ALL || airFreight.length > 1)
            return airFreight;
          else return airFreight[0];
        }
      }
    }

    throw new NotFoundException('Air Freight not found');
  }

  @Post()
  async createAirFreight(
    @Body(new ZodValidationPipe(CreateAirFreightSchema)) body: CreateAirFreightDto,
  ) {
    const createRes = await this.airFreightService.createAirFreight(body); 
    return { message: `Air Freight created`, data: createRes }; 
  }

  @Patch(':id')
  async updateAirFreight(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(CreateAirFreightSchema.partial())) 
    body: Partial<CreateAirFreightDto>,
  ) {
    if (Object.keys(body).length === 0)
      throw new BadRequestException('Body is empty');
      
    const updateResponse = await this.airFreightService.updateAirFreight(id, body);
    return { message: 'Air Freight updated', data: updateResponse }; 
  }
}
