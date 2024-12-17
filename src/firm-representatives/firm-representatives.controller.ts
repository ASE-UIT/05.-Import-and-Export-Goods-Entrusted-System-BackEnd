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

import { FirmRepsService } from './firm-representatives.service';
import {
  CreateFirmRepDto,
  CreateFirmRepSchema,
  UpdateFirmRepDto,
} from './dtos/create-firm-representatives.dto';

import {
  QueryFirmRepDto,
  QueryFirmRepSchema,
} from './dtos/query-firm-representatives.dto';

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
import { FirmRep } from './models/firm-representatives.model';
import { PaginationDto, PaginationSchema } from '@/shared/dto/pagination.dto';

@ApiTags('Firm representatives')
@Controller({
  path: 'firm-representatives',
  version: '1',
})
export class FirmRepsController {
  constructor(private firmRepsService: FirmRepsService) {}

  @ApiOperation({ summary: 'Create new firm representative' })
  @ApiResponse({
    status: 201,
    description: 'Firm representative created successfully',
    type: createResponseType('Firm representative created successfully',FirmRep),
    example: {
      "name": 'John Doe',
      "phone": '1234567890',
      "email": 'johndoe@example.com',
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body',
    type: ValidationError,
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication is required to create a firm representative',
    type: UnauthorizedException,
    example: new UnauthorizedException('Only authenticated users can access this resource').getResponse(),
  })
  @ApiResponse({
    status: 403,
    description: 'Only user with role: [ADMIN | MANAGER] can perform this action',
    type: ForbiddenException,
    example: new ForbiddenException('Only users with the following roles can access this resource: ADMIN, MANAGER').getResponse(),
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    type: ValidationError,
  })
  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.MANAGER])
  @Post()
  async createFirmReps(
    @Body(new ZodValidationPipe(CreateFirmRepSchema)) 
    firmRepsData: CreateFirmRepDto,
  ) {
    const createdFirmRep = await this.firmRepsService.createFirmReps(firmRepsData);
      return new SuccessResponse('Firm representative created successfully', createdFirmRep);
  }

  @ApiOperation({ summary: "Update firm representative's information" })
  @ApiBody({
    type: UpdateFirmRepDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Firm representative updated successfully',
    type: createResponseType('Firm representative updated successfully',FirmRep),
    example: {
      "name": 'Updated name',
      "phone": '123456',
      "email": 'UpdatedEmail@example.com',
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body',
    type: ValidationError,
  })
  @ApiResponse({
    status: 401,
    description: "Authentication is required to update a firm representative's information",
    type: UnauthorizedException,
    example: new UnauthorizedException('Only authenticated users can access this resource').getResponse(),
  })
  @ApiResponse({
    status: 403,
    description: 'Only user with role: [ADMIN | MANAGER] can perform this action',
    type: ForbiddenException,
    example: new ForbiddenException('Only users with the following roles can access this resource: ADMIN, MANAGER').getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'The provided firm representative information does not exist',
    type: NotFoundException,
    example: new NotFoundException('Firm representative not found').getResponse(),
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Conflict', 
    type: ValidationError 
  })
  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.MANAGER])
  @Patch(':id')
  async updateFirmReps(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateFirmRepDto)) 
    updateData: UpdateFirmRepDto,
  ) {
    if (Object.keys(updateData).length === 0)
      throw new BadRequestException('Body is empty or invalid field names');
    const updateResponse = await this.firmRepsService.updateFirmReps(
      id,
      updateData,
    );
    return new SuccessResponse('Firm representative updated successfully', updateResponse);
  }

  @ApiOperation({ summary: 'Search for firm representatives' })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Current page',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Total records per page',
  })
  @ApiQuery({
    name: 'name',
    type: String,
    required: false,
    description: 'Search firm representative by name',
  })
  @ApiQuery({
    name: 'phone',
    type: String,
    required: false,
    description: 'Search firm representative by phone number',
  })
  @ApiQuery({
    name: 'email',
    type: String,
    required: false,
    description: 'Search firm representative by email',
  })
  @ApiQuery({
    name: 'id',
    type: String,
    required: false,
    description: 'Search firm representative by id',
  })
  @ApiResponse({
    status: 200,
    description: 'Firm representative found',
    type: FirmRep,
  })
  @ApiResponse({
    status: 400,
    description: 'Unrecognized key(s) in query',
  })
  @ApiResponse({
    status: 401,
    description: "Authentication is required to find firm representative's information",
    type: UnauthorizedException,
    example: new UnauthorizedException('Only authenticated users can access this resource').getResponse(),
  })
  @ApiResponse({
    status: 403,
    description: 'Only user with role: [ADMIN | MANAGER] can perform this action',
    type: ForbiddenException,
    example: new ForbiddenException('Only users with the following roles can access this resource: ADMIN, MANAGER').getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'Firm representative not found',
    type: NotFoundException,
    example: new NotFoundException('Firm representative not found').getResponse(),
  })
  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.MANAGER])
  @Get()
  async findFirmReps(
    @Query(new ZodValidationPipe(QueryFirmRepSchema.partial())) query: QueryFirmRepDto,
    @Query(new ZodValidationPipe(PaginationSchema.partial())) pagination: Partial<PaginationDto>,
  ) {
    const result = await this.firmRepsService.findFirmReps(query, pagination);
    return new SuccessResponse('Firm representative found', result);
  }
}
