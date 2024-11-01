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
  UseGuards,
} from '@nestjs/common';
import { AirFreightService } from './airFreight.service';
import { FindAirFreightStrategy } from './strategies/find-air-freight/find-air-freight-strategy.enum';
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
import { CreateAirFreightDto, CreateAirFreightSchema, UpdateAirFreightDto } from './dtos/CreateAirFreightDto';
import { AirFreight } from './models/airFreight.model';

import { RoleGuard } from '@/shared/guards/role.guard';
import { Roles } from '@/shared/decorators/role.decorator';
import { RoleEnum } from '@/shared/enums/roles.enum';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
  PartialType,
} from '@nestjs/swagger';

@ApiTags('Air freight')

@Controller({
  path: 'air-freight',
  version: '1',
})
export class AirFreightController {
  constructor(private airFreightService: AirFreightService) { }

  // @UseGuards(RoleGuard)
  // @Roles([
  //   RoleEnum.ADMIN,
  //   RoleEnum.SALES,
  //   RoleEnum.CUSTOMER_SERVICE,
  //   RoleEnum.MANAGER,
  // ])
  @ApiOperation({ summary: 'Search for air freight' })
  @ApiQuery({
    name: 'price_0K',
    type: Number,
    required: false,
    description: 'Search air freight by price for 0KG',
  })
  @ApiQuery({
    name: 'price_45K',
    type: Number,
    required: false,
    description: 'Search air freight by price for 45KG',
  })
  @ApiQuery({
    name: 'price_100K',
    type: Number,
    required: false,
    description: 'Search air freight by price for 100KG',
  })
  @ApiQuery({
    name: 'price_300K',
    type: Number,
    required: false,
    description: 'Search air freight by price for 300KG',
  })
  @ApiQuery({
    name: 'price_500K',
    type: Number,
    required: false,
    description: 'Search air freight by price for 500KG',
  })
  @ApiQuery({
    name: 'freight_id',
    type: String,
    required: false,
    description: 'Search air freight by freight id',
  })
  @ApiOkResponse({ description: 'Air freight found' })
  @ApiNotFoundResponse({ description: 'Air freight not found' })
  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong. Contact backend team at once',
  })
  @ApiUnauthorizedResponse({
    description: 'Not logged in or account has unappropriate role',
  })
  
  @Get()
  async findAirFreight(
    @Query(new ZodValidationPipe(CreateAirFreightSchema.partial())) query: Partial<CreateAirFreightDto>,
  ) { 
    if (Object.keys(query).length === 0) {
      return await this.airFreightService.find(FindAirFreightStrategy.ALL,'',);
    }

    const queryFields: { [key: string]: FindAirFreightStrategy } = {
      all: FindAirFreightStrategy.ALL,
      price_0k: FindAirFreightStrategy.PRICE_0K,
      price_45k: FindAirFreightStrategy.PRICE_45K,
      price_100k: FindAirFreightStrategy.PRICE_100K,
      price_300k: FindAirFreightStrategy.PRICE_300K,
      price_500k: FindAirFreightStrategy.PRICE_500K,
      freight_id: FindAirFreightStrategy.FREIGHT_ID,
    };

    for (const [key, strategy] of Object.entries(queryFields)) {
      const value = query[key as keyof CreateAirFreightDto];
      if (value) {
        const data = await this.airFreightService.find(strategy, value);
        if (data.length > 0) {
          if (strategy === FindAirFreightStrategy.ALL || data.length > 1)
            return data;
          else return data[0];
        }
      }
    }

    throw new NotFoundException('Air Freight not found');
  }

  // @UseGuards(RoleGuard)
  // @Roles([
  //   RoleEnum.ADMIN,
  //   RoleEnum.SALES,
  //   RoleEnum.CUSTOMER_SERVICE,
  //   RoleEnum.MANAGER,
  // ])
  @ApiOperation({ summary: 'Create new air freight' })
  @ApiBody({
    type: CreateAirFreightDto,
  })
  @ApiCreatedResponse({ description: 'New air freight created' })
  @ApiBadRequestResponse({ description: 'Invalid body' })
  @ApiConflictResponse({ description: 'Unique information already exist' })
  @ApiUnauthorizedResponse({
    description: 'Not logged in or account has unappropriate role',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong. Contact backend team at once',
  })
  @ApiBody({
    type: CreateAirFreightDto,
    examples: {
      example: {
        description: 'Create a new air freight with basic pricing details',
        value: {
          price_0K: 100.0,
          price_45K: 150.0,
          price_100K: 200.0,
          price_300K: 250.0,
          price_500K: 300.0,
          freight_id: '123e4567-e89b-12d3-a456-426614174000',
        },
      },
    },
  })

  
  @Post()
  async createAirFreight(
    @Body(new ZodValidationPipe(CreateAirFreightSchema)) body: CreateAirFreightDto,
  ) {
    const data = await this.airFreightService.create(body);
    return { message: 'Air freight created', data };
  }

  // @UseGuards(RoleGuard)
  // @Roles([
  //   RoleEnum.ADMIN,
  //   RoleEnum.SALES,
  //   RoleEnum.CUSTOMER_SERVICE,
  //   RoleEnum.MANAGER,
  // ])
  @ApiOperation({ summary: "Update air freight's information" })
  @ApiOkResponse({ description: 'New information updated' })
  @ApiBadRequestResponse({ description: 'Empty body or misspelled property' })
  @ApiNotFoundResponse({ description: 'Could not find air freight to update' })
  @ApiUnauthorizedResponse({
    description: 'Not logged in or account has unappropriate role',
  })
  @ApiBody({
    type: UpdateAirFreightDto,
    examples: {
      example: {
        description: 'Able to update one or more fields of Air Freight',
        value: {
          price_0K: 100.0,
          price_45K: 200.0,
          price_100K: 300.0,
          price_300K: 400.0,
          price_500K: 500.0,
          freight_id: 'a42cd726-b9ff-4363-a087-c771f28ffef3',
        },
      },
    },
  })

  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong. Contact backend team at once',
  })

  @Patch(':id')
  async updateAirFreight(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(CreateAirFreightSchema.partial())) body: Partial<CreateAirFreightDto>,
  ) {
    if (Object.keys(body).length === 0) {
      throw new BadRequestException('Body is empty');
    }
    const data = await this.airFreightService.update(id, body);
    return data;
  }
}


