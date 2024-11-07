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

import { ContactRepsService } from './contact-representatives.service';
import {
  CreateContactRepDto,
  CreateContactRepSchema,
  UpdateContactRepDto,
} from './dtos/create-contact-representatives.dto';

import {
  QueryContactRepDto,
  QueryContactRepSchema,
} from './dtos/query-contact-representatives.dto';

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
import { ContactRep } from './models/contact-representatives.model';

@ApiTags('Contact representatives')
@Controller({
  path: 'contact-representatives',
  version: '1',
})
export class ContactRepsController {
  constructor(private contactRepsService: ContactRepsService) {}

  @ApiOperation({ summary: 'Create new contact representative' })
  @ApiResponse({
    status: 201,
    description: 'Contatct representative created successfully',
    type: createResponseType('Contatct representative created successfully',ContactRep),
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
    description: 'Authentication is required to create a contact representative',
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
  async createContactReps(
    @Body(new ZodValidationPipe(CreateContactRepSchema)) 
    contactRepsData: CreateContactRepDto,
  ) {
    const createdContactRep = await this.contactRepsService.createContactReps(contactRepsData);
      return new SuccessResponse('Contact representative created successfully', createdContactRep);
  }

  @ApiOperation({ summary: "Update contact representative's information" })
  @ApiBody({
    type: UpdateContactRepDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Contact representative updated successfully',
    type: createResponseType('Contact representative updated successfully',ContactRep),
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
    description: "Authentication is required to update a contact representative's information",
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
    description: 'The provided contact representative information does not exist',
    type: NotFoundException,
    example: new NotFoundException('Contact representative not found').getResponse(),
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Conflict', 
    type: ValidationError 
  })
  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.MANAGER])
  @Patch(':id')
  async updateContactReps(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateContactRepDto)) 
    updateData: UpdateContactRepDto,
  ) {
    if (Object.keys(updateData).length === 0)
      throw new BadRequestException('Body is empty or invalid field names');
    const updateResponse = await this.contactRepsService.updateContactReps(
      id,
      updateData,
    );
    return new SuccessResponse('Contact representative updated successfully', updateResponse);
  }

  @ApiOperation({ summary: 'Search for contact representatives' })
  @ApiQuery({
    name: 'name',
    type: String,
    required: false,
    description: 'Search contact representative by name',
  })
  @ApiQuery({
    name: 'phone',
    type: String,
    required: false,
    description: 'Search contact representative by phone number',
  })
  @ApiQuery({
    name: 'email',
    type: String,
    required: false,
    description: 'Search contact representative by email',
  })
  @ApiResponse({
    status: 200,
    description: 'Contact representative found',
    type: ContactRep,
  })
  @ApiResponse({
    status: 400,
    description: 'Unrecognized key(s) in query',
  })
  @ApiResponse({
    status: 401,
    description: "Authentication is required to find contact representative's information",
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
    description: 'Contact representative not found',
    type: NotFoundException,
    example: new NotFoundException('Contact representative not found').getResponse(),
  })
  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.MANAGER])
  @Get()
  async findContactReps(
    @Query(new ZodValidationPipe(QueryContactRepSchema.partial().strict())) query: QueryContactRepDto,
  ) {
    const result = await this.contactRepsService.findContactReps(query);
    return new SuccessResponse('Contact representative found', result);
  }
}
