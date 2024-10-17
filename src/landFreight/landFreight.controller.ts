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
import { QueryLandFreightDto, QueryLandFreightSchema } from './dtos/QueryLandFreightDto';
import {
  CreateLandFreightDto,
  CreateLandFreightSchema,
} from './dtos/CreateLandFreightDto';
import { LandFreight } from './models/landFreight.model';

@Controller({
  path: 'landFreight',
  version: '1',
})
export class LandFreightController {
  constructor(private landFreightService: LandFreightService) {}

  @Get()
  async findLandFreight(
    @Query(new ZodValidationPipe(QueryLandFreightSchema)) query: QueryLandFreightDto,
  ): Promise<LandFreight[]> {
    if (Object.keys(query).length === 0)
      return this.landFreightService.find( 
        FindLandFreightStrategy.ALL,
        '',
      );

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
      const value = query[key as keyof QueryLandFreightDto];
      if (value) {
        const landFreight = await this.landFreightService.find(strategy, value);
        if (landFreight.length > 0) {
          if (strategy === FindLandFreightStrategy.ALL || landFreight.length > 1)
            return landFreight;
          else return [landFreight[0]];
        }
      }
    }

    throw new NotFoundException('Land Freight not found');
  }

  @Post()
  async createLandFreight(
    @Body(new ZodValidationPipe(CreateLandFreightSchema)) body: CreateLandFreightDto,
  ): Promise<{ message: string; data: LandFreight }> {
    const createRes = await this.landFreightService.create(body); 
    return createRes ; 
  }

  @Patch(':id')
  async updateLandFreight(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(CreateLandFreightSchema.partial())) 
    body: Partial<CreateLandFreightDto>,
  ): Promise<{ message: string; data: LandFreight }> {
    if (Object.keys(body).length === 0)
      throw new BadRequestException('Body is empty');
      
    const updateResponse = await this.landFreightService.update(id, body);
    return updateResponse; 
  }
}
