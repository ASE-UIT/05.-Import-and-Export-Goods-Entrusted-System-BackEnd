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
import { AirFreightService } from './air-freights.service';
import { CreateAirFreightDto, CreateAirFreightSchema, UpdateAirFreightDto } from './dtos/create-air-freights.dto';
import { AirFreight } from './models/air-freights.model';
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
import { QueryAirFreightDto, QueryAirFreightSchema } from './dtos/query-air-freight.dto';
@ApiTags('Air freights')

@Controller({
  path: 'air-freights',
  version: '1',
})
export class AirFreightController {
  constructor(private airFreightService: AirFreightService) { }

  @ApiOperation({ summary: 'Search for air freights' })
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
  @ApiQuery({
    name: 'airFreight_id',
    type: String,
    required: false,
    description: 'Search air freight by id',
  })
  @ApiResponse({
    status: 200,
    description: 'Air freight found',
    type: AirFreight,
  })
  @ApiResponse({
    status: 400,
    description: 'Unrecognized key(s) in query',
  })
  @ApiResponse({
    status: 401,
    description: "Authentication is required to find air freight's information",
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
    description: 'Air freight not found',
    type: NotFoundException,
    example: new NotFoundException('Air freight not found').getResponse(),
  })
  @UseGuards(RoleGuard)
  @Roles([
    RoleEnum.ADMIN,
    RoleEnum.SALES,
    RoleEnum.CUSTOMER_SERVICE,
    RoleEnum.MANAGER,
  ])
  @Get()
  async findAirFreight(
    @Query(new ZodValidationPipe(QueryAirFreightSchema.strict())) query: QueryAirFreightDto,
  ) { 
    const result = await this.airFreightService.find(query);
    return new SuccessResponse('Air freight found', result);
  }

  @ApiOperation({ summary: 'Create new air freight' })
  @ApiResponse({
    status: 201,
    description: 'Air freight created',
    type: createResponseType('Air freight created', AirFreight),
    example: {
      "price_0K": 100.0,
      "price_45K": 150.0,
      "price_100K": 200.0,
      "price_300K": 250.0,
      "price_500K": 300.0,
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
    description: 'Authentication is required to create a air freight',
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
    description: 'The provided freight information does not exist',
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
  @Post()
  async createAirFreight(
    @Body(new ZodValidationPipe(CreateAirFreightSchema)) body: CreateAirFreightDto,
  ) {
    const data = await this.airFreightService.create(body);
    return new SuccessResponse('Air freight created', data);
  }

  @ApiOperation({ summary: "Update air freight's information" })
  @ApiBody({
    type: UpdateAirFreightDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Air freight updated',
    type: createResponseType('Air freight updated', AirFreight),
    example: {
      "price_0K": 100.0,
      "price_45K": 200.0,
      "price_100K": 300.0,
      "price_300K": 400.0,
      "price_500K": 500.0,
      "freight_id": 'a42cd726-b9ff-4363-a087-c771f28ffef3',
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body',
    type: ValidationError,
  })
  @ApiResponse({
    status: 401,
    description: "Authentication is required to update a air freight's information",
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
    description: 'The provided air freight information does not exist',
    type: NotFoundException,
    example: new NotFoundException('Air freight not found').getResponse(),
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
  async updateAirFreight(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateAirFreightDto)) body: UpdateAirFreightDto,
  ) {
    if (Object.keys(body).length === 0) {
      throw new BadRequestException('Body is empty or invalid field names');
    }
    const data = await this.airFreightService.update(id, body);
    return new SuccessResponse('Air freight updated', data);
  }
}


