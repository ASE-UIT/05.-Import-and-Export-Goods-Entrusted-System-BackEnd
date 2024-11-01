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
import { FreightService } from './freight.service';
import { FindFreightStrategy } from './strategies/find-freight/find-freight-strategy.enum';
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
import { QueryFreightDto, QueryFreightSchema } from './dtos/QueryFreightDto';
import {
  CreateFreightDto,
  CreateFreightSchema,
} from './dtos/CreateFreightDto';
import { Freight, FreightType } from './models/freight.model';
import { UpdateFreightDto, UpdateFreightSchema } from './dtos/UpdateFreightDto';

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
import { Roles } from '@/shared/decorators/role.decorator';
import { RoleEnum } from '@/shared/enums/roles.enum';
import { RoleGuard } from '@/shared/guards/role.guard';

@ApiTags('Freights')
@Controller({
  path: 'freights',
  version: '1',
})
export class FreightController {
  constructor(private freightService: FreightService) {}

  // @UseGuards(RoleGuard)
  // @Roles([
  //   RoleEnum.ADMIN,
  //   RoleEnum.SALES,
  //   RoleEnum.CUSTOMER_SERVICE,
  //   RoleEnum.MANAGER,
  // ])

  @ApiOperation({ summary: 'Search for freights' })
  @ApiQuery({
    name: 'freightType',
    enum: FreightType,
    required: false,
    description: 'Search freight by type',
  })
  @ApiQuery({
    name: 'origin',
    type: String,
    required: false,
    description: 'Search freight by origin',
  })
  @ApiQuery({
    name: 'destination',
    type: String,
    required: false,
    description: 'Search freight by destination',
  })
  @ApiQuery({
    name: 'transitTime',
    type: Number,
    required: false,
    description: 'Search freight by transit time',
  })
  @ApiQuery({
    name: 'additionFee',
    type: Number,
    required: false,
    description: 'Search freight by additional fee',
  })
  @ApiQuery({
    name: 'additionFeeBreakDown',
    type: String,
    required: false,
    description: 'Search freight by additional fee break down',
  })
  @ApiQuery({
    name: 'validFrom',
    type: String,
    required: false,
    description: 'Search freight valid from date',
  })
  @ApiQuery({
    name: 'validUntil',
    type: String,
    required: false,
    description: 'Search freight valid until date',
  })
  @ApiQuery({
    name: 'schedule',
    type: String,
    required: false,
    description: 'Search freight by schedule',
  })
  @ApiQuery({
    name: 'provider_id',
    type: String,
    required: false,
    description: 'Search freight by provider_id',
  })
  @ApiOkResponse({ description: 'Freight found' })
  @ApiNotFoundResponse({ description: 'Freight not found' })
  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong. Contact backend team at once',
  })
  @ApiUnauthorizedResponse({
    description: 'Not logged in or account has unappropriate role',
  })
  
  @Get()
  async findFreight(
    @Query(new ZodValidationPipe(QueryFreightSchema)) query: QueryFreightDto,
  ) {
    if (Object.keys(query).length === 0) {
      return await this.freightService.find(
        FindFreightStrategy.ALL,
        '',
      );
    }

    const queryFields: { [key: string]: FindFreightStrategy } = {
      additional_fee: FindFreightStrategy.ADDITIONAL_FEE,
      additional_fee_breakdown: FindFreightStrategy.ADDITIONAL_FEE_BREAKDOWN,
      destination: FindFreightStrategy.DESTINATION,
      origin: FindFreightStrategy.ORIGIN,
      transit_time: FindFreightStrategy.TRANSIT_TIME,
      freight_type: FindFreightStrategy.FREIGHT_TYPE,
      valid_from: FindFreightStrategy.VALID_FROM,
      valid_until: FindFreightStrategy.VALID_UNTIL,
      schedule: FindFreightStrategy.SCHEDULE,
      provider_id: FindFreightStrategy.PROVIDER_ID,
    };

    for (const [key, strategy] of Object.entries(queryFields)) {
      const value = query[key as keyof QueryFreightDto];
      if (value) {
        const data = await this.freightService.find(strategy, value);
        if (data.length > 0) {
          if (strategy === FindFreightStrategy.ALL || data.length > 1)
            return data;
          else return data[0];
        }
      }
    }

    throw new NotFoundException('Freight not found');
  }
  @ApiOperation({ summary: 'Create new freight' })
  @ApiBody({
    type: CreateFreightDto,
  })
  @ApiCreatedResponse({ description: 'New freight created' })
  @ApiBadRequestResponse({ description: 'Invalid body' })
  @ApiConflictResponse({ description: 'Unique information already exist' })
  @ApiUnauthorizedResponse({
    description: 'Not logged in or account has unappropriate role',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong. Contact backend team at once',
  })
  @ApiBody({
    type: CreateFreightDto,
    examples: {
      example: {
        description: 'Create a new freight with basic details',
        value: {
          freightType: 'AIR',
          origin: 'Hanoi',
          destination: 'Ho Chi Minh City',
          transitTime: 3,
          additionFee: 150.0,
          validFrom: '2024-01-01T00:00:00Z',
          validUntil: '2024-12-31T00:00:00Z',
          addition_fee_breakdown: 'Fees for customs clearance',
          schedule: 'MONDAY, WEDNESDAY, FRIDAY',
          provider_id: '123e4567-e89b-12d3-a456-426614174000',
        },
      },
    },
  })

  @Post()
  async createFreight(
    @Body(new ZodValidationPipe(CreateFreightSchema)) body: CreateFreightDto,
  ) {
    const data = await this.freightService.create(body);
    return { message: 'Freight created successfully', data };
  }

  @ApiOperation({ summary: "Update freight's information" })
  @ApiOkResponse({ description: 'New information updated' })
  @ApiBadRequestResponse({ description: 'Empty body or misspelled property' })
  @ApiNotFoundResponse({ description: 'Could not find freight to update' })
  @ApiUnauthorizedResponse({
    description: 'Not logged in or account has unappropriate role',
  })
  @ApiBody({
    type: UpdateFreightDto,
    examples: {
      example: {
        description: 'Able to update one or more fields',
        value: {
          freightType: 'AIR',
          origin: 'Da Nang',
          destination: 'Hanoi',
          transitTime: 5,
          additionFee: 200.0,
          validFrom: '2024-01-01T00:00:00Z', 
          validUntil: '2024-12-31T00:00:00Z',
          addition_fee_breakdown: 'Updated fees for customs clearance',
          schedule: 'TUESDAY, THURSDAY',
          provider_id: '123e4567-e89b-12d3-a456-426614174000',
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong. Contact backend team at once',
  })

  @Patch(':id')
  async updateFreight(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateFreightSchema)) body: UpdateFreightDto,
  ) {
    if (Object.keys(body).length === 0) {
      throw new BadRequestException('Body is empty');
    }
    const data = await this.freightService.update(id, body);
    return data;
  }
}
