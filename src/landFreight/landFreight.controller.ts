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
import { LandFreightService } from './landfreight.service'; 
import { FindLandFreightStrategy } from './strategies/find-land-freight/find-land-freight-strategy.enum';
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
import { QueryLandFreightDto, QueryLandFreightSchema } from './dtos/QueryLandFreightDto';
import {
  CreateLandFreightDto,
  CreateLandFreightSchema,
} from './dtos/CreateLandFreightDto';

@Controller({
  path: 'landfreight',
  version: '1',
})
export class LandFreightController {
  constructor(private landFreightService: LandFreightService) {}

  @Get()
  async getLandFreight(
    @Query(new ZodValidationPipe(QueryLandFreightSchema)) query: QueryLandFreightDto,
  ) {
    if (Object.keys(query).length === 0)
      return await this.landFreightService.findLandFreight( 
        FindLandFreightStrategy.ALL,
        '',
      );

    const queryFields: { [key: string]: FindLandFreightStrategy } = {
      all: FindLandFreightStrategy.ALL,
      price100_200: FindLandFreightStrategy.PRICE_100_200,
      price200_500: FindLandFreightStrategy.PRICE_200_500,
      price500_1500: FindLandFreightStrategy.PRICE_500_1500,
      price1500_5000: FindLandFreightStrategy.PRICE_1500_5000,
      price5000_10000: FindLandFreightStrategy.PRICE_5000_10000,
      price10000: FindLandFreightStrategy.PRICE_10000,
      freight_id: FindLandFreightStrategy.FREIGHT_ID,
    };

    for (const [key, strategy] of Object.entries(queryFields)) {
      const value = query[key as keyof QueryLandFreightDto];
      if (value) {
        const landFreight = await this.landFreightService.findLandFreight(strategy, value.toString());
        if (landFreight.length > 0) {
          if (strategy === FindLandFreightStrategy.ALL || landFreight.length > 1)
            return landFreight;
          else return landFreight[0];
        }
      }
    }

    throw new NotFoundException('Land Freight not found');
  }

  @Post()
  async createLandFreight(
    @Body(new ZodValidationPipe(CreateLandFreightSchema)) body: CreateLandFreightDto,
  ) {
    const createRes = await this.landFreightService.createLandFreight(body); 
    return { message: `Land Freight created`, data: createRes }; 
  }

  @Patch(':id')
  async updateLandFreight(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(CreateLandFreightSchema.partial())) 
    body: Partial<CreateLandFreightDto>,
  ) {
    if (Object.keys(body).length === 0)
      throw new BadRequestException('Body is empty');
      
    const updateResponse = await this.landFreightService.updateLandFreight(id, body);
    return { message: 'Land Freight updated', data: updateResponse }; 
  }
}
