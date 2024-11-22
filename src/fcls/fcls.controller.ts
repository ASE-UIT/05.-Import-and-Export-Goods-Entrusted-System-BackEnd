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
import { FCLService } from './fcls.service';
import { CreateFclDto, CreateFclSchema, UpdateFclDto } from './dtos/create-fcls.dto';
import { FCL } from './models/fcls.model';
import { RoleGuard } from '@/shared/guards/role.guard';
import { Roles } from '@/shared/decorators/role.decorator';
import { RoleEnum } from '@/shared/enums/roles.enum';
import { ZodValidationPipe } from 'nestjs-zod';
import { SuccessResponse } from '@/shared/classes/success-response.class';
import { createResponseType } from '@/shared/helpers/create-response.mixin';
import { ValidationError } from '@/shared/classes/validation-error.class';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { QueryFclDto, QueryFclSchema } from './dtos/query-fcls.dto';

@ApiTags('FCL')
@Controller({
  path: 'fcls',
  version: '1',
})
export class FCLController {
  constructor(private fclService: FCLService) {}

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
  @ApiQuery({
    name: 'fcl_id',
    type: String,
    required: false,
    description: 'Search FCL by id',
  })
  @ApiResponse({
    status: 200,
    description: 'FCL found',
    type: FCL,
  })
  @ApiResponse({
    status: 400,
    description: 'Unrecognized key(s) in query',
    type: ValidationError,
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication is required to find FCL information',
    type: UnauthorizedException,
    example: new UnauthorizedException('Only authenticated users can access this resource').getResponse(),
  })
  @ApiResponse({
    status: 403,
    description: 'Only users with specific roles can perform this action',
    type: ForbiddenException,
    example: new ForbiddenException('Only users with the following roles can access this resource: ADMIN, SALES, CUSTOMER_SERVICE, MANAGER').getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'FCL not found',
    type: NotFoundException,
    example: new NotFoundException('FCL not found').getResponse(),
  })
  @UseGuards(RoleGuard)
  @Roles([
    RoleEnum.ADMIN, 
    RoleEnum.SALES, 
    RoleEnum.CUSTOMER_SERVICE, 
    RoleEnum.MANAGER])
  @Get()
  async findFcl(
    @Query(new ZodValidationPipe(QueryFclSchema.strict())) query: QueryFclDto) {
    const result = await this.fclService.find(query);
    return new SuccessResponse('FCL found', result);
  }

  @ApiOperation({ summary: 'Create new FCL' })
  @ApiResponse({
    status: 201,
    description: 'FCL created',
    type: createResponseType('FCL created', FCL),
    example: {
      "price_20dc": 500.0,
      "price_40dc": 1000.0,
      "price_40hc": 1200.0,
      "price_20rf": 600.0,
      "price_40rf": 1100.0,
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
    description: 'Authentication is required to create an FCL',
    type: UnauthorizedException,
    example: new UnauthorizedException('Only authenticated users can access this resource').getResponse(),
  })
  @ApiResponse({
    status: 403,
    description: 'Only users with specific roles can perform this action',
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
    RoleEnum.MANAGER])
  @Post()
  async createFcl(
    @Body(new ZodValidationPipe(CreateFclSchema)) body: CreateFclDto) {
    const data = await this.fclService.create(body);
    return new SuccessResponse('FCL created', data);
  }

  @ApiOperation({ summary: "Update FCL's information" })
  @ApiBody({
    type: UpdateFclDto,
  })
  @ApiResponse({
    status: 201,
    description: 'FCL updated',
    type: createResponseType('FCL updated', FCL),
    example: {
      "price_20dc": 500.0,
      "price_40dc": 1000.0,
      "price_40hc": 1500.0,
      "price_20rf": 600.0,
      "price_40rf": 1100.0,
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
    description: 'Authentication is required to update an FCL',
    type: UnauthorizedException,
    example: new UnauthorizedException('Only authenticated users can access this resource').getResponse(),
  })
  @ApiResponse({
    status: 403,
    description: 'Only users with specific roles can perform this action',
    type: ForbiddenException,
    example: new ForbiddenException('Only users with the following roles can access this resource: ADMIN, SALES, CUSTOMER_SERVICE, MANAGER').getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'The provided fcl information does not exist',
    type: NotFoundException,
    example: new NotFoundException('Fcl not found').getResponse(),
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
    RoleEnum.MANAGER])
  @Patch(':id')
  async updateFcl(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateFclDto)) body: UpdateFclDto,
  ) {
    if (Object.keys(body).length === 0) {
      throw new BadRequestException('Body is empty or invalid field names');
    }
    const data = await this.fclService.update(id, body);
    return new SuccessResponse('FCL updated', data);
  }
}
