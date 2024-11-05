import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { FreightService } from './freights.service';
import { QueryFreightDto, QueryFreightSchema } from './dtos/query-freights.dto';
import {
  CreateFreightDto,
  CreateFreightSchema,
} from './dtos/create-freights.dto';
import { Freight, FreightType } from './models/freights.model';
import { UpdateFreightDto, UpdateFreightSchema } from './dtos/update-freights.dto';

import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '@/shared/decorators/role.decorator';
import { RoleEnum } from '@/shared/enums/roles.enum';
import { RoleGuard } from '@/shared/guards/role.guard';
import { SuccessResponse } from '@/shared/classes/success-response.class';
import { createResponseType } from '@/shared/helpers/create-response.mixin';
import { ValidationError } from '@/shared/classes/validation-error.class';
import { ZodValidationPipe } from 'nestjs-zod';

@ApiTags('Freights')
@Controller({
  path: 'freights',
  version: '1',
})
export class FreightController {
  constructor(private freightService: FreightService) {}

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
    name: 'providerId',
    type: String,
    required: false,
    description: 'Search freight by provider id',
  })
  @ApiResponse({
    status: 200,
    description: 'Freight found',
    type: Freight,
  })
  @ApiResponse({
    status: 400,
    description: 'Unrecognized key(s) in query',
  })
  @ApiResponse({
    status: 401,
    description: "Authentication is required to find freight's information",
    type: UnauthorizedException,
    example: new UnauthorizedException('Only authenticated users can access this resource').getResponse(),
  })
  @ApiResponse({
    status: 403,
    description:'Only user with role: [ADMIN | SALES | CUSTOMER_SERVICE | MANAGER] can perform this action',
    type: ForbiddenException,
    example: new ForbiddenException('Only users with the following roles can access this resource: ADMIN, SALES, CUSTOMER_SERVICE, MANAGER').getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'Freight not found',
    type: NotFoundException,
    example: new NotFoundException('Freight not found').getResponse(),
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    type: ValidationError,
  })
  @UseGuards(RoleGuard)
  @Roles([
    RoleEnum.ADMIN,
    RoleEnum.SALES,
    RoleEnum.CUSTOMER_SERVICE,
    RoleEnum.MANAGER,
  ])
  @Get()
  async findFreight(
    @Query(new ZodValidationPipe(QueryFreightSchema.strict())) query: QueryFreightDto,
  ) {
    const result = await this.freightService.find(query);
    return new SuccessResponse('Freight found', result);
  }

  @ApiOperation({ summary: 'Create new freight' })
  @ApiResponse({
    status: 201,
    description: 'Freight created',
    type: createResponseType('Freight created', Freight),
    example: {
      "freightType": 'AIR',
      "origin": 'Hanoi',
      "destination": 'Ho Chi Minh City',
      "transitTime": 3,
      "additionFee": 150.0,
      "validFrom": '2024-01-01T00:00:00Z',
      "validUntil": '2024-12-31T00:00:00Z',
      "addition_fee_breakdown": 'Fees for customs clearance',
      "schedule": 'MONDAY',
      "providerId": '123e4567-e89b-12d3-a456-426614174000',
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body',
    type: ValidationError,
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication is required to create a freight',
    type: UnauthorizedException,
    example: new UnauthorizedException('Only authenticated users can access this resource').getResponse(),
  })
  @ApiResponse({
    status: 403,
    description: 'Only user with role: [ADMIN | SALES | CUSTOMER_SERVICE | MANAGER] can perform this action',
    type: ForbiddenException,
    example: new ForbiddenException('Only users with the following roles can access this resource: ADMIN, SALES, CUSTOMER_SERVICE, MANAGER').getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'The provided freight information does not exist',
    type: NotFoundException,
    example: new NotFoundException('Provider not found').getResponse(),
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    type: ValidationError,
  })
  @UseGuards(RoleGuard)
  @Roles([
    RoleEnum.ADMIN,
    RoleEnum.SALES,
    RoleEnum.CUSTOMER_SERVICE,
    RoleEnum.MANAGER,
  ])
  @Post()
  async createFreight(
    @Body(new ZodValidationPipe(CreateFreightSchema)) body: CreateFreightDto,
  ) {
    const data = await this.freightService.create(body);
    return new SuccessResponse('Freight created', data);
  }

  @ApiOperation({ summary: "Update freight's information" })
  @ApiBody({
    type: UpdateFreightDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Freight updated',
    type: createResponseType('Freight updated', Freight),
    example: {
      "freightType": 'AIR',
      "origin": 'Da Nang',
      "destination": 'Hanoi',
      "transitTime": 5,
      "additionFee": 200.0,
      "validFrom": '2024-01-01T00:00:00Z', 
      "validUntil": '2024-12-31T00:00:00Z',
      "addition_fee_breakdown": 'Updated fees for customs clearance',
      "schedule": 'TUESDAY',
      "providerId": '123e4567-e89b-12d3-a456-426614174000',
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body',
    type: ValidationError,
  })
  @ApiResponse({
    status: 401,
    description: "Authentication is required to update a freight's information",
    type: UnauthorizedException,
    example: new UnauthorizedException('Only authenticated users can access this resource').getResponse(),
  })
  @ApiResponse({
    status: 403,
    description: 'Only user with role: [ADMIN | SALES | CUSTOMER_SERVICE | MANAGER] can perform this action',
    type: ForbiddenException,
    example: new ForbiddenException('Only users with the following roles can access this resource: ADMIN, SALES, CUSTOMER_SERVICE, MANAGER').getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'The provided freight information does not exist',
    type: NotFoundException,
    example: new NotFoundException('Freight not found').getResponse(),
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Conflict', 
    type: ValidationError 
  })
  @UseGuards(RoleGuard)
  @Roles([
    RoleEnum.ADMIN,
    RoleEnum.SALES,
    RoleEnum.CUSTOMER_SERVICE,
    RoleEnum.MANAGER,
  ])
  @Patch(':id')
  async updateFreight(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateFreightDto)) body: UpdateFreightDto,
  ) {
    if (Object.keys(body).length === 0) {
      throw new BadRequestException('Body is empty or invalid field names');
    }
    const data = await this.freightService.update(id, body);
    return new SuccessResponse('Freight updated', data);
  }
}
