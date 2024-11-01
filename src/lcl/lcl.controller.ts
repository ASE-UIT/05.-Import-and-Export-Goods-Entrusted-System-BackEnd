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
import { CreateLclSchema, CreateLclDto, UpdateLclDto } from './dtos/CreateLclDto';
import { FindLclStrategy } from './strategies/find-lcl/find-lcl-strategy.enum';
import { LCL } from './models/lcl.model';
import { LCLService } from './lcl.service';

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

@ApiTags('LCL')
@Controller({
  path: 'lcls',
  version: '1',
})
export class LCLController {
  constructor(private lclService: LCLService) { }

  // @UseGuards(RoleGuard)
  // @Roles([
  //   RoleEnum.ADMIN,
  //   RoleEnum.SALES,
  //   RoleEnum.CUSTOMER_SERVICE,
  //   RoleEnum.MANAGER,
  // ])
  @ApiOperation({ summary: 'Search for LCL' })
  @ApiQuery({
    name: 'cost',
    type: Number,
    required: false,
    description: 'Search LCL by cost',
  })
  @ApiQuery({
    name: 'freight_id',
    type: String,
    required: false,
    description: 'Search LCL by freight id',
  })
  @ApiOkResponse({ description: 'LCL found', type: LCL }) 
  @ApiNotFoundResponse({ description: 'LCL not found' })
  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong. Contact backend team at once',
  })
  @ApiUnauthorizedResponse({
    description: 'Not logged in or account has inappropriate role',
  })

  @Get()
  async findLcl(
    @Query(new ZodValidationPipe(CreateLclSchema.partial())) query: Partial<CreateLclDto>,
  ) { 
    if (Object.keys(query).length === 0) {
      return await this.lclService.find(FindLclStrategy.ALL, '');;
    }

    const queryFields: { [key: string]: FindLclStrategy } = {
      all: FindLclStrategy.ALL,
      cost: FindLclStrategy.COST,
      freight_id: FindLclStrategy.FREIGHT_ID,
    };

    for (const [key, strategy] of Object.entries(queryFields)) {
      const value = query[key as keyof CreateLclDto];
      if (value) {
        const data = await this.lclService.find(strategy, value);
        if (data.length > 0) {
          if (strategy === FindLclStrategy.ALL || data.length > 1)
            return data;
          else return data[0];
        }
      }
    }

    throw new NotFoundException('LCL not found');
  }

  // @UseGuards(RoleGuard)
  // @Roles([
  //   RoleEnum.ADMIN,
  //   RoleEnum.SALES,
  //   RoleEnum.CUSTOMER_SERVICE,
  //   RoleEnum.MANAGER,
  // ])
  @ApiOperation({ summary: 'Create new LCL' })
  @ApiBody({
    type: CreateLclDto, 
    examples: {
      example: {
        description: 'Create a new LCL with basic pricing details',
        value: {
          cost: 100.0,
          freight_id: '123e4567-e89b-12d3-a456-426614174000',
        },
      },
    },
  })
  @ApiCreatedResponse({ description: 'New LCL created' })
  @ApiBadRequestResponse({ description: 'Invalid body' })
  @ApiConflictResponse({ description: 'Unique information already exists' })
  @ApiUnauthorizedResponse({
    description: 'Not logged in or account has inappropriate role',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong. Contact backend team at once',
  })

  @Post()
  async createLcl(
    @Body(new ZodValidationPipe(CreateLclSchema)) body: CreateLclDto,
  ) {
    const data = await this.lclService.create(body);
    return { message: 'LCL created', data };
  }

  // @UseGuards(RoleGuard)
  // @Roles([
  //   RoleEnum.ADMIN,
  //   RoleEnum.SALES,
  //   RoleEnum.CUSTOMER_SERVICE,
  //   RoleEnum.MANAGER,
  // ])
  @ApiOperation({ summary: "Update LCL's information" })
  @ApiOkResponse({ description: 'LCL information updated' })
  @ApiBadRequestResponse({ description: 'Empty body or misspelled property' })
  @ApiNotFoundResponse({ description: 'Could not find LCL freight to update' })
  @ApiUnauthorizedResponse({
    description: 'Not logged in or account has inappropriate role',
  })
  @ApiBody({
    type: UpdateLclDto, 
    examples: {
      example: {
        description: 'Able to update one or more fields of LCL',
        value: {
          cost: 200.0,
          freight_id: 'a42cd726-b9ff-4363-a087-c771f28ffef3',
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong. Contact backend team at once',
  })

  @Patch(':id')
  async updateLcl(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(CreateLclSchema.partial())) body: Partial<CreateLclDto>,
  ) {
    if (Object.keys(body).length === 0) {
      throw new BadRequestException('Body is empty');
    }
    const data = await this.lclService.update(id, body);
    return data;
  }
}
