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
import { LandFreightService } from './land-freights.service';
import { CreateLandFreightDto, CreateLandFreightSchema, UpdateLandFreightDto } from './dtos/create-land-freights.dto';
import { LandFreight } from './models/land-freights.model';

import { RoleGuard } from '@/shared/guards/role.guard';
import { Roles } from '@/shared/decorators/role.decorator';
import { RoleEnum } from '@/shared/enums/roles.enum';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SuccessResponse } from '@/shared/classes/success-response.class';
import { createResponseType } from '@/shared/helpers/create-response.mixin';
import { ValidationError } from '@/shared/classes/validation-error.class';
import { ZodValidationPipe } from 'nestjs-zod';
import { QueryLandFreightDto, QueryLandFreightSchema } from './dtos/query-land-freights.dto';
@ApiTags('Land freight')
@Controller({
  path: 'land-freights',
  version: '1',
})
export class LandFreightController {
  constructor(private landFreightService: LandFreightService) { }

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
  @ApiResponse({
    status: 200,
    description: 'Land freight found',
    type: LandFreight,
  })
  @ApiResponse({
    status: 400,
    description: 'Unrecognized key(s) in query',
  })
  @ApiResponse({
    status: 401,
    description: "Authentication is required to find land freight's information",
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
    description: 'Land freight not found',
    type: NotFoundException,
    example: new NotFoundException('Land freight not found').getResponse(),
  })
  @UseGuards(RoleGuard)
  @Roles([
    RoleEnum.ADMIN,
    RoleEnum.SALES,
    RoleEnum.CUSTOMER_SERVICE,
    RoleEnum.MANAGER,
  ])

  @Get()
  async findLandFreight(
    @Query(new ZodValidationPipe(QueryLandFreightSchema.strict())) query: QueryLandFreightDto,
  ) { 
    const result = await this.landFreightService.find(query);
    return new SuccessResponse('Land freight found', result);
  }

  @ApiOperation({ summary: 'Create new land freight' })
  @ApiResponse({
    status: 201,
    description: 'Land freight created',
    type: createResponseType('Land freight created', LandFreight),
    example: {
      "price_0_100": 100.0,
      "price_100_200": 150.0,
      "price_200_500": 200.0,
      "price_500_1500": 250.0,
      "price_1500_5000": 300.0,
      "price_5000_10000": 350.0,
      "price_10000": 400.0,
      "freight_id": '123e4567-e89b-12d3-a456-426614174000',
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body',
    type: ValidationError,
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication is required to create a land freight',
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
    description: 'The provided land freight information does not exist',
    type: NotFoundException,
    example: new NotFoundException('Land freight not found').getResponse(),
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
  async createLandFreight(
    @Body(new ZodValidationPipe(CreateLandFreightSchema)) body: CreateLandFreightDto,
  ) {
    const data = await this.landFreightService.create(body);
    return new SuccessResponse('Land freight created', data);
  }

  @ApiOperation({ summary: "Update land freight's information" })
  @ApiBody({
    type: UpdateLandFreightDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Land freight updated',
    type: createResponseType('Land freight updated', LandFreight),
    example: {
      "price_0_100": 100.0,
      "price_100_200": 160.0,
      "price_200_500": 200.0,
      "price_500_1500": 250.0,
      "price_1500_5000": 300.0,
      "price_5000_10000": 350.0,
      "price_10000": 400.0,
      "freight_id": '123e4567-e89b-12d3-a456-426614174000',
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body',
    type: ValidationError,
  })
  @ApiResponse({
    status: 401,
    description: "Authentication is required to update a land freight's information",
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
    description: 'The provided land freight information does not exist',
    type: NotFoundException,
    example: new NotFoundException('Land freight not found').getResponse(),
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
  async updateLandFreight(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateLandFreightDto)) body: UpdateLandFreightDto,
  ) {
    if (Object.keys(body).length === 0) {
      throw new BadRequestException('Body is empty or invalid field names');
    }
    const data = await this.landFreightService.update(id, body);
    return new SuccessResponse('Land freight updated', data);
  }
}
