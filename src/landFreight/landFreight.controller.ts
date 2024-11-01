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
import { CreateLandFreightDto, CreateLandFreightSchema, UpdateLandFreightDto } from './dtos/CreateLandFreightDto';
import { LandFreight } from './models/landFreight.model';

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

@ApiTags('Land freight')
@Controller({
  path: 'land-freight',
  version: '1',
})
export class LandFreightController {
  constructor(private landFreightService: LandFreightService) { }

  // @UseGuards(RoleGuard)
  // @Roles([
  //   RoleEnum.ADMIN,
  //   RoleEnum.SALES,
  //   RoleEnum.CUSTOMER_SERVICE,
  //   RoleEnum.MANAGER,
  // ])
  @ApiOperation({ summary: 'Search for land freight' })
  @ApiQuery({
    name: 'price_0_100',
    type: Number,
    required: false,
    description: 'Search land freight by price for 0-100 KG',
  })
  @ApiQuery({
    name: 'price_100_200',
    type: Number,
    required: false,
    description: 'Search land freight by price for 100-200 KG',
  })
  @ApiQuery({
    name: 'price_200_500',
    type: Number,
    required: false,
    description: 'Search land freight by price for 200-500 KG',
  })
  @ApiQuery({
    name: 'price_500_1500',
    type: Number,
    required: false,
    description: 'Search land freight by price for 500-1500 KG',
  })
  @ApiQuery({
    name: 'price_1500_5000',
    type: Number,
    required: false,
    description: 'Search land freight by price for 1500-5000 KG',
  })
  @ApiQuery({
    name: 'price_5000_10000',
    type: Number,
    required: false,
    description: 'Search land freight by price for 5000-10000 KG',
  })
  @ApiQuery({
    name: 'price_10000',
    type: Number,
    required: false,
    description: 'Search land freight by price for more than 10000 KG',
  })
  @ApiQuery({
    name: 'freight_id',
    type: String,
    required: false,
    description: 'Search land freight by freight ID',
  })
  @ApiOkResponse({ description: 'Land freight found' })
  @ApiNotFoundResponse({ description: 'Land freight not found' })
  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong. Contact backend team at once',
  })
  @ApiUnauthorizedResponse({
    description: 'Not logged in or account has inappropriate role',
  })

  @Get()
  async findLandFreight(
    @Query(new ZodValidationPipe(CreateLandFreightSchema.partial())) query: Partial<CreateLandFreightDto>,
  ) { 
    if (Object.keys(query).length === 0) {
      return await this.landFreightService.find(FindLandFreightStrategy.ALL, '');
    }

    const queryFields: { [key: string]: FindLandFreightStrategy } = {
      all: FindLandFreightStrategy.ALL,
      price_0_100: FindLandFreightStrategy.PRICE_0_100,
      price_100_200: FindLandFreightStrategy.PRICE_100_200,
      price_200_500: FindLandFreightStrategy.PRICE_200_500,
      price_500_1500: FindLandFreightStrategy.PRICE_500_1500,
      price_1500_5000: FindLandFreightStrategy.PRICE_1500_5000,
      price_5000_10000: FindLandFreightStrategy.PRICE_5000_10000,
      price_10000: FindLandFreightStrategy.PRICE_10000,
      freigt_id: FindLandFreightStrategy.FREIGHT_ID,
    };

    for (const [key, strategy] of Object.entries(queryFields)) {
      const value = query[key as keyof CreateLandFreightDto];
      if (value) {
        const data = await this.landFreightService.find(strategy, value);
        if (data.length > 0) {
          if (strategy === FindLandFreightStrategy.ALL || data.length > 1)
            return data;
          else return data[0];
        }
      }
    }

    throw new NotFoundException('Land Freight not found');
  }

  // @UseGuards(RoleGuard)
  // @Roles([
  //   RoleEnum.ADMIN,
  //   RoleEnum.SALES,
  //   RoleEnum.CUSTOMER_SERVICE,
  //   RoleEnum.MANAGER,
  // ])
  @ApiOperation({ summary: 'Create new land freight' })
  @ApiBody({
    type: CreateLandFreightDto,
  })
  @ApiCreatedResponse({ description: 'New land freight created' })
  @ApiBadRequestResponse({ description: 'Invalid body' })
  @ApiConflictResponse({ description: 'Unique information already exist' })
  @ApiUnauthorizedResponse({
    description: 'Not logged in or account has unappropriate role',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong. Contact backend team at once',
  })
  @ApiBody({
    type: CreateLandFreightDto, 
    examples: {
      example: {
        description: 'Create a new land freight with basic pricing details',
        value: {
          price_0_100: 100.0,
          price_100_200: 150.0,
          price_200_500: 200.0,
          price_500_1500: 250.0,
          price_1500_5000: 300.0,
          price_5000_10000: 350.0,
          price_10000: 400.0,
          freight_id: '123e4567-e89b-12d3-a456-426614174000',
        },
      },
    },
  })

  @Post()
  async createLandFreight(
    @Body(new ZodValidationPipe(CreateLandFreightSchema)) body: CreateLandFreightDto,
  ) {
    const data = await this.landFreightService.create(body);
    return { message: 'Land freight created', data };
  }

  // @UseGuards(RoleGuard)
  // @Roles([
  //   RoleEnum.ADMIN,
  //   RoleEnum.SALES,
  //   RoleEnum.CUSTOMER_SERVICE,
  //   RoleEnum.MANAGER,
  // ])
  @ApiOperation({ summary: "Update land freight's information" })
  @ApiOkResponse({ description: 'New information updated' })
  @ApiBadRequestResponse({ description: 'Empty body or misspelled property' })
  @ApiNotFoundResponse({ description: 'Could not find land freight to update' })
  @ApiUnauthorizedResponse({
    description: 'Not logged in or account has unappropriate role',
  })
  @ApiBody({
    type: UpdateLandFreightDto,
    examples: {
      example: {
        description: 'Able to update one or more fields of Land Freight',
        value: {
          price_0_100: 100.0,
          price_100_200: 200.0,
          price_200_500: 300.0,
          price_500_1500: 400.0,
          price_1500_5000: 500.0,
          price_5000_10000: 600.0,
          price_10000: 700.0,
          freight_id: 'a42cd726-b9ff-4363-a087-c771f28ffef3',
        },
      },
    },
  })

  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong. Contact backend team at once',
  })
  @Patch(':id')
  async updateLandFreight(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(CreateLandFreightSchema.partial())) body: Partial<CreateLandFreightDto>,
  ) {
    if (Object.keys(body).length === 0) {
      throw new BadRequestException('Body is empty');
    }
    const data = await this.landFreightService.update(id, body);
    return data;
  }
}
