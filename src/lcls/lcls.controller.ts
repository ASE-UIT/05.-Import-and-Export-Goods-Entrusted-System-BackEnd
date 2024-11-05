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
import { ZodValidationPipe } from 'nestjs-zod';
import { CreateLclDto, CreateLclSchema, UpdateLclDto } from './dtos/create-lcls.dto';
import { LCL } from './models/lcls.model';
import { LCLService } from './lcls.service';
import { RoleGuard } from '@/shared/guards/role.guard';
import { Roles } from '@/shared/decorators/role.decorator';
import { RoleEnum } from '@/shared/enums/roles.enum';
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
import { QueryLclDto, QueryLclSchema } from './dtos/query-lcls.dto';

@ApiTags('LCL')
@Controller({
  path: 'lcls',
  version: '1',
})
export class LCLController {
  constructor(private lclService: LCLService) {}

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
    description: 'Search LCL by freight ID',
  })
  @ApiResponse({
    status: 200,
    description: 'LCL found',
    type: LCL,
  })
  @ApiResponse({
    status: 400,
    description: 'Unrecognized key(s) in query',
    type: ValidationError,
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication is required to access LCL information',
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
    description: 'LCL not found',
    type: NotFoundException,
    example: new NotFoundException('LCL not found').getResponse(),
  })
  @UseGuards(RoleGuard)
  @Roles([
    RoleEnum.ADMIN, 
    RoleEnum.SALES, 
    RoleEnum.CUSTOMER_SERVICE, 
    RoleEnum.MANAGER])
  @Get()
  async findLcl(
    @Query(new ZodValidationPipe(QueryLclSchema.strict())) query: QueryLclDto,
  ) {
    const result = await this.lclService.find(query);
    return new SuccessResponse('LCL found', result);
  }

  @ApiOperation({ summary: 'Create new LCL' })
  @ApiResponse({
    status: 201,
    description: 'LCL created',
    type: createResponseType('LCL created', LCL),
    example: {
      "cost": 100.0,
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
    description: 'Authentication is required to create an LCL',
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
    description: 'The provided lcl information does not exist',
    type: NotFoundException,
    example: new NotFoundException('Lcl not found').getResponse(),
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
  async createLcl(
    @Body(new ZodValidationPipe(CreateLclSchema)) body: CreateLclDto,
  ) {
    const data = await this.lclService.create(body);
    return new SuccessResponse('LCL created', data);
  }

  @ApiOperation({ summary: "Update LCL's information" })
  @ApiBody({
    type: UpdateLclDto,
  })
  @ApiResponse({
    status: 200,
    description: 'LCL updated',
    type: createResponseType('LCL updated', LCL),
    example: {
      "cost": 150.0,
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
    description: 'Authentication is required to update an LCL',
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
    description: 'LCL not found',
    type: NotFoundException,
    example: new NotFoundException('Lcl not found').getResponse(),
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
  @Patch(':id')
  async updateLcl(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateLclDto)) body: UpdateLclDto,
  ) {
    if (Object.keys(body).length === 0) {
      throw new BadRequestException('Body is empty or invalid fields');
    }
    const data = await this.lclService.update(id, body);
    return new SuccessResponse('LCL updated', data);
  }
}
