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
import { ZodValidationPipe } from 'nestjs-zod';
import { CreateFclSchema, CreateFclDto, UpdateFclDto } from './dtos/CreateFclDto';
import { FCLService } from './fcl.service';
import { FCL } from './models/fcl.model';
import { FindFclStrategy } from './strategies/find-fcl/find-fcl-strategy.enum';

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

@ApiTags('FCL')
@Controller({
  path: 'fcls',
  version: '1',
})
export class FCLController {
  constructor(private fclService: FCLService) { }

  // @UseGuards(RoleGuard)
  // @Roles([
  //   RoleEnum.ADMIN,
  //   RoleEnum.SALES,
  //   RoleEnum.CUSTOMER_SERVICE,
  //   RoleEnum.MANAGER,
  // ])
  @ApiOperation({ summary: 'Search for FCL' })
  @ApiQuery({
    name: 'price_20dc',
    type: Number,
    required: false,
    description: 'Search FCL by price for 20DC',
  })
  @ApiQuery({
    name: 'price_40dc',
    type: Number,
    required: false,
    description: 'Search FCL by price for 40DC',
  })
  @ApiQuery({
    name: 'price_40hc',
    type: Number,
    required: false,
    description: 'Search FCL by price for 40HC',
  })
  @ApiQuery({
    name: 'price_20rf',
    type: Number,
    required: false,
    description: 'Search FCL by price for 20RF',
  })
  @ApiQuery({
    name: 'price_40rf',
    type: Number,
    required: false,
    description: 'Search FCL by price for 40RF',
  })
  @ApiQuery({
    name: 'freight_id',
    type: String,
    required: false,
    description: 'Search FCL by freight id',
  })
  @ApiOkResponse({ description: 'FCL found' })
  @ApiNotFoundResponse({ description: 'FCL not found' })
  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong. Contact backend team at once',
  })
  @ApiUnauthorizedResponse({
    description: 'Not logged in or account has inappropriate role',
  })

  @Get()
  async findFcl(
    @Query(new ZodValidationPipe(CreateFclSchema.partial())) query: Partial<CreateFclDto>,
  ) { 
    if (Object.keys(query).length === 0) {
      return await this.fclService.find(FindFclStrategy.ALL, '');
    }

    const queryFields: { [key: string]: FindFclStrategy } = {
      all: FindFclStrategy.ALL,
      price20dc: FindFclStrategy.PRICE_20DC,
      price20rf: FindFclStrategy.PRICE_20RF,
      price40dc: FindFclStrategy.PRICE_40DC,
      price40hc: FindFclStrategy.PRICE_40HC,
      price40rf: FindFclStrategy.PRICE_40RF,
      freight_id: FindFclStrategy.FREIGHT_ID,
    };

    for (const [key, strategy] of Object.entries(queryFields)) {
      const value = query[key as keyof CreateFclDto];
      if (value) {
        const data = await this.fclService.find(strategy, value);
        if (data.length > 0) {
          if (strategy === FindFclStrategy.ALL || data.length > 1)
            return data;
          else return data[0];
        }
      }
    }

    throw new NotFoundException('FCL not found');
  }

  // @UseGuards(RoleGuard)
  // @Roles([
  //   RoleEnum.ADMIN,
  //   RoleEnum.SALES,
  //   RoleEnum.CUSTOMER_SERVICE,
  //   RoleEnum.MANAGER,
  // ])
  @ApiOperation({ summary: 'Create new FCL' })
  @ApiBody({
    type: CreateFclDto, 
    examples: {
      example: {
        description: 'Create a new FCL with basic pricing details',
        value: {
          price_20dc: 500.0,
          price_40dc: 1000.0,
          price_40hc: 1200.0,
          price_20rf: 600.0,
          price_40rf: 1100.0,
          freight_id: '123e4567-e89b-12d3-a456-426614174000',
        },
      },
    },
  })
  @ApiCreatedResponse({ description: 'New FCL created' })
  @ApiBadRequestResponse({ description: 'Invalid body' })
  @ApiConflictResponse({ description: 'Unique information already exists' })
  @ApiUnauthorizedResponse({
    description: 'Not logged in or account has inappropriate role',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong. Contact backend team at once',
  })

  @Post()
  async createFcl(
    @Body(new ZodValidationPipe(CreateFclSchema)) body: CreateFclDto,
  ) {
    const data = await this.fclService.create(body);
    return { message: 'FCL created', data };
  }

  // @UseGuards(RoleGuard)
  // @Roles([
  //   RoleEnum.ADMIN,
  //   RoleEnum.SALES,
  //   RoleEnum.CUSTOMER_SERVICE,
  //   RoleEnum.MANAGER,
  // ])
  @ApiOperation({ summary: "Update FCL's information" })
  @ApiOkResponse({ description: 'FCL information updated' })
  @ApiBadRequestResponse({ description: 'Empty body or misspelled property' })
  @ApiNotFoundResponse({ description: 'Could not find FCL freight to update' })
  @ApiUnauthorizedResponse({
    description: 'Not logged in or account has inappropriate role',
  })
  @ApiBody({
    type: UpdateFclDto, 
    examples: {
      example: {
        description: 'Able to update one or more fields of FCL freight',
        value: {
          price_20dc: 600.0, 
          price_40dc: 1200.0,
          price_40hc: 1400.0,
          price_20rf: 700.0,
          price_40rf: 1300.0,
          freight_id: 'a42cd726-b9ff-4363-a087-c771f28ffef3',
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong. Contact backend team at once',
  })

  @Patch(':id')
  async updateFcl(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(CreateFclSchema.partial())) body: Partial<CreateFclDto>,
  ) {
    if (Object.keys(body).length === 0) {
      throw new BadRequestException('Body is empty');
    }
    const data = await this.fclService.update(id, body);
    return data;
  }
}
