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

import { CreateContactRepFirmRepDto, CreateContactRepFirmRepSchema, UpdateContactRepFirmRepDto } from './dtos/create-contact-firm-representatives.dto';
import { ContactRepFirmRepService } from './contact-firm-representatives.service';
import { RoleGuard } from '@/shared/guards/role.guard';
import { Roles } from '@/shared/decorators/role.decorator';
import { RoleEnum } from '@/shared/enums/roles.enum';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '@/shared/classes/success-response.class';
import { ZodValidationPipe } from 'nestjs-zod';
import { ContactRepFirmRep } from './models/contact-firm-representatives.model';
import { QueryContactRepFirmRepDto, QueryContactRepFirmRepSchema } from './dtos/query-contact-firm-representatives.dto';
import { PaginationDto, PaginationSchema } from '@/shared/dto/pagination.dto';

@ApiTags('Contact Representative Firm Relationship')
@Controller({
  path: 'contact-representatives-firm-representatives',
  version: '1',
})
export class ContactRepFirmRepController {
  constructor(private contactRepFirmRepService: ContactRepFirmRepService) {}

  @ApiOperation({ summary: 'Create a relation between Contact Representative and Firm Representative' })
  @ApiResponse({
    status: 201,
    description: 'Relation created successfully',
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body',
    type: BadRequestException,
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication is required to create a relation between contact representative and firm representative',
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
    description: 'Contact Representative or Firm Representative not found',
    type: NotFoundException,
  })
  // @UseGuards(RoleGuard)
  // @Roles([RoleEnum.ADMIN, RoleEnum.MANAGER])
  @Post()
  async addContactRepToFirmRep(
    @Body(new ZodValidationPipe(CreateContactRepFirmRepSchema)) contactRepFirmRepData: CreateContactRepFirmRepDto,
  ) {
    const createdRelation = await this.contactRepFirmRepService.createContactRepFirmRep(contactRepFirmRepData);
    return new SuccessResponse('Relation created successfully', createdRelation);
  }

  @ApiOperation({ summary: 'Update a relation between Contact Representative and Firm Representative' })
  @ApiBody({
    type: UpdateContactRepFirmRepDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Relation updated successfully',
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body',
    type: BadRequestException,
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication is required to update a relation between contact representative and firm representative',
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
    description: 'Contact Representative or Firm Representative not found for update',
    type: NotFoundException,
  })
  // @UseGuards(RoleGuard)
  // @Roles([RoleEnum.ADMIN, RoleEnum.MANAGER])
  @Patch(':id')
  async updateContactRepFirmRep(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateContactRepFirmRepDto)) updateData: UpdateContactRepFirmRepDto,
  ) {
    const updatedRelation = await this.contactRepFirmRepService.updateContactRepFirmRep(id, updateData);
    return new SuccessResponse('Relation updated successfully', updatedRelation);
  }

  @ApiOperation({ summary: 'Find relations by Contact Representative' })
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
    name: 'id',
    type: String,
    required: true,
    description: 'Search relations by ID',
  })
  @ApiQuery({
    name: 'contactRepId',
    type: String,
    required: true,
    description: 'Search relations by Contact Representative ID',
  })
  @ApiQuery({
    name: 'firmRepId',
    type: String,
    required: true,
    description: 'Search relations by Firm Representative ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Relations found successfully',
    type: [ContactRepFirmRep],
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication is required to find relations',
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
    description: 'No relations found',
    type: NotFoundException,
  })
  // @UseGuards(RoleGuard)
  // @Roles([RoleEnum.ADMIN, RoleEnum.MANAGER])
  @Get()
  async findRelations(
    @Query(new ZodValidationPipe(QueryContactRepFirmRepSchema.partial())) query: QueryContactRepFirmRepDto,
    @Query(new ZodValidationPipe(PaginationSchema.partial())) pagination: Partial<PaginationDto>,
  ) {
    const result = await this.contactRepFirmRepService.findContactRepFirmRep(query, pagination);
    return new SuccessResponse('Contact representative found', result);
  }
}
