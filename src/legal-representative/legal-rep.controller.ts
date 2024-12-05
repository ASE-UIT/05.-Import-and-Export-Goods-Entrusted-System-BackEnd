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
import { LegalRepsService } from './legal-rep.service';
import {
  CreateLegalRepDto,
  CreateLegalRepSchema,
  UpdateLegalRepDto,
} from './dtos/create-legal-rep.dto';

import {
  QueryLegalRepsDto,
  QueryLegalRepsSchema,
} from './dtos/query-legal-rep.dto';
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
import { LegalRep } from './models/legal-rep.model';
import { ValidationError } from '@/shared/classes/validation-error.class';
import { ZodValidationPipe } from 'nestjs-zod';
import { PaginationDto, PaginationSchema } from '@/shared/dto/pagination.dto';

@ApiTags('Legal representatives')
@Controller({
  path: 'legal-reps',
  version: '1',
})
export class LegalRepsController {
  constructor(private legalRepsService: LegalRepsService) {}

  @ApiOperation({ summary: 'Create new legal representative' })
  @ApiResponse({
    status: 201,
    description: 'Legal representative created',
    type: createResponseType('Legal representative created', LegalRep),
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body',
    type: ValidationError,
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication is required to create a legal-rep',
    type: UnauthorizedException,
    example: new UnauthorizedException(
      'Only authenticated users can access this resource',
    ).getResponse(),
  })
  @ApiResponse({
    status: 403,
    description:
      'Only user with role: [ADMIN | MANAGER] can perform this action',
    type: ForbiddenException,
    example: new ForbiddenException(
      'Only users with the following roles can access this resource: ADMIN, MANAGER',
    ).getResponse(),
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    type: ValidationError,
  })
  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.MANAGER])
  @Post()
  async createLegalReps(
    @Body(new ZodValidationPipe(CreateLegalRepSchema))
    legalRepsData: CreateLegalRepDto,
  ) {
    const createRes =
      await this.legalRepsService.createLegalReps(legalRepsData);
    return new SuccessResponse('Legal representative created', createRes);
  }

  @ApiOperation({ summary: "Update legal representative's information" })
  @ApiBody({
    type: UpdateLegalRepDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Legal representative updated',
    type: createResponseType('Legal representative updated', LegalRep),
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body',
    type: ValidationError,
  })
  @ApiResponse({
    status: 401,
    description:
      "Authentication is required to update a legal-rep's information",
    type: UnauthorizedException,
    example: new UnauthorizedException(
      'Only authenticated users can access this resource',
    ).getResponse(),
  })
  @ApiResponse({
    status: 403,
    description:
      'Only user with role: [ADMIN | MANAGER] can perform this action',
    type: ForbiddenException,
    example: new ForbiddenException(
      'Only users with the following roles can access this resource: ADMIN, MANAGER',
    ).getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'The provided legal-rep information does not exist',
    type: NotFoundException,
    example: new NotFoundException(
      'Legal representative not found',
    ).getResponse(),
  })
  @ApiResponse({ status: 409, description: 'Conflict', type: ValidationError })
  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.MANAGER])
  @Patch(':id')
  async updateLegalReps(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateLegalRepDto))
    updateData: UpdateLegalRepDto,
  ) {
    if (Object.keys(updateData).length === 0)
      throw new BadRequestException('Body is empty or invalid field names');
    const updateResponse = await this.legalRepsService.updateLegalReps(
      id,
      updateData,
    );
    return new SuccessResponse('Legal representative updated', updateResponse);
  }

  @ApiOperation({ summary: 'Search for legal representative' })
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
    description: 'Search legal-rep by name',
  })
  @ApiQuery({
    name: 'phone',
    type: String,
    required: false,
    description: 'Search legal-rep by phone number',
  })
  @ApiQuery({
    name: 'email',
    type: String,
    required: false,
    description: 'Search legal-rep by email',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: LegalRep,
  })
  @ApiResponse({
    status: 400,
    description: 'Unrecognized key(s) in query',
  })
  @ApiResponse({
    status: 401,
    description: "Authentication is required to find legal-rep's information",
    type: UnauthorizedException,
    example: new UnauthorizedException(
      'Only authenticated users can access this resource',
    ).getResponse(),
  })
  @ApiResponse({
    status: 403,
    description:
      'Only user with role: [ADMIN | MANAGER] can perform this action',
    type: ForbiddenException,

    example: new ForbiddenException(
      'Only users with the following roles can access this resource: ADMIN, MANAGER',
    ).getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'Legal representative not found',
    type: NotFoundException,
    example: new NotFoundException(
      'Legal representative not found',
    ).getResponse(),
  })
  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.MANAGER])
  @Get()
  async findLegalReps(
    @Query(new ZodValidationPipe(QueryLegalRepsSchema.partial()))
    query: QueryLegalRepsDto,
    @Query(new ZodValidationPipe(PaginationSchema.partial()))
    pagination: Partial<PaginationDto>,
  ) {
    const result = await this.legalRepsService.findLegalReps(query, pagination);
    return new SuccessResponse('Success', result);
  }

  @ApiOperation({ summary: 'Search for legal representative by id' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: LegalRep,
  })
  @ApiResponse({
    status: 401,
    description: "Authentication is required to find legal-rep's information",
    type: UnauthorizedException,
    example: new UnauthorizedException(
      'Only authenticated users can access this resource',
    ).getResponse(),
  })
  @ApiResponse({
    status: 403,
    description:
      'Only user with role: [ADMIN | MANAGER] can perform this action',
    type: ForbiddenException,

    example: new ForbiddenException(
      'Only users with the following roles can access this resource: ADMIN, MANAGER',
    ).getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'Legal representative not found',
    type: NotFoundException,
    example: new NotFoundException(
      'Legal representative not found',
    ).getResponse(),
  })
  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.MANAGER])
  @Get(':id')
  async findLegalRepsById(
    @Param('id')
    id: string,
  ) {
    const result = await this.legalRepsService.findLegalRepById(id);
    return new SuccessResponse('Success', result);
  }
}
