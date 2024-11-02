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
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';

import {
  QueryLegalRepsDto,
  QueryLegalRepsSchema,
} from './dtos/query-legal-rep.dto';
import { FindLegalRepsStrategy } from './strategies/find-legal-rep/find-legal-rep-strategy.enum';
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
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UUIDV4 } from 'sequelize';
import { SuccessResponse } from '@/shared/classes/success-response.class';
import { createResponseType } from '@/shared/helpers/create-response.mixin';
import { LegalRep } from './models/legal-rep.model';
import { ValidationError } from '@/shared/classes/validation-error.class';

@ApiTags('Legal representatives')
@Controller({
  path: 'legal-reps',
  version: '1',
})
export class LegalRepsController {
  constructor(private legalRepsService: LegalRepsService) {}

  @ApiOperation({ summary: 'Create new customer' })
  @ApiResponse({
    status: 201,
    description: 'Legal representative created successfully',
    type: createResponseType(
      'Legal representative created successfully',
      LegalRep,
    ),
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
    example: new UnauthorizedException().getResponse(),
  })
  @ApiResponse({
    status: 403,
    description:
      'Only user with role: [ADMIN | MANAGER] can perform this action',
    type: ForbiddenException,
    example: new ForbiddenException().getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'The provided legal-rep information does not exist',
    type: NotFoundException,
    example: new NotFoundException().getResponse(),
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
    return new SuccessResponse(
      'Legal representative created successfully',
      createRes,
    );
  }

  @ApiOperation({ summary: "Update customer's information" })
  @ApiBody({
    type: UpdateLegalRepDto,
    examples: {
      example: {
        description: 'Able to update one or more fields in CreateCustomerDto',
        value: {
          name: 'Updated name',
          phone: '123456',
          email: 'UpdatedEmail@example.com',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Legal representative updated successfully',
    type: createResponseType(
      'Legal representative updated successfully',
      LegalRep,
    ),
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
    example: new UnauthorizedException().getResponse(),
  })
  @ApiResponse({
    status: 403,
    description:
      'Only user with role: [ADMIN | MANAGER] can perform this action',
    type: ForbiddenException,
    example: new ForbiddenException().getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'The provided legal-rep information does not exist',
    type: NotFoundException,
    example: new NotFoundException().getResponse(),
  })
  @ApiResponse({ status: 409, description: 'Conflict', type: ValidationError })
  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.MANAGER])
  @Patch(':id')
  async updateLegalReps(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(CreateLegalRepSchema.partial()))
    updateData: Partial<CreateLegalRepDto>,
  ) {
    if (Object.keys(updateData).length === 0)
      throw new BadRequestException('Body is empty or invalid field names');
    const updateResponse = await this.legalRepsService.updateLegalReps(
      id,
      updateData,
    );
    return new SuccessResponse(
      'Legal representative updated successfully',
      updateResponse,
    );
  }

  @ApiOperation({ summary: 'Search for legal representatives' })
  @ApiQuery({
    name: 'name',
    type: String,
    required: false,
    description: 'Search legalRep by name',
  })
  @ApiQuery({
    name: 'phone',
    type: String,
    required: false,
    description: 'Search legalRep by phone number',
  })
  @ApiQuery({
    name: 'email',
    type: String,
    required: false,
    description: 'Search legalRep by email',
  })
  @ApiResponse({
    status: 200,
    description: 'Shipment founded',
    example: {
      id: '112fad97-b247-49f8-855c-65b22dab4189',
      name: 'rep3',
      email: 'rep3@example.com',
      phone: '654321',
      createdAt: '2024-10-24T14:33:15.881Z',
      updatedAt: '2024-10-24T14:33:15.881Z',
    },
  })
  @ApiResponse({
    status: 401,
    description: "Authentication is required to find legal-rep's information",
    type: UnauthorizedException,
    example: new UnauthorizedException().getResponse(),
  })
  @ApiResponse({
    status: 403,
    description:
      'Only user with role: [ADMIN | MANAGER] can perform this action',
    type: ForbiddenException,

    example: new ForbiddenException().getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'Legal representative not found',
    type: NotFoundException,
    example: new NotFoundException().getResponse(),
  })
  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.MANAGER])
  @Get()
  async findLegalReps(
    @Query(new ZodValidationPipe(QueryLegalRepsSchema))
    query: QueryLegalRepsDto,
  ) {
    if (Object.keys(query).length === 0)
      return await this.legalRepsService.findLegalReps(
        FindLegalRepsStrategy.ALL,
        '',
      );

    const queryFields: { [key: string]: FindLegalRepsStrategy } = {
      name: FindLegalRepsStrategy.NAME,
      customerId: FindLegalRepsStrategy.CUSTOMER_ID,
      phone: FindLegalRepsStrategy.PHONE,
      email: FindLegalRepsStrategy.EMAIL,
    };

    // Assign corrisponding strategy to query fields
    for (const [key, strategy] of Object.entries(queryFields)) {
      const value = query[key as keyof QueryLegalRepsDto];
      if (value) {
        const customer = await this.legalRepsService.findLegalReps(
          strategy,
          value,
        );
        if (customer.length > 0) {
          if (strategy === FindLegalRepsStrategy.ALL || customer.length > 1)
            return customer;
          else return customer[0];
        }
      }
    }

    // Cant find customer
    throw new NotFoundException('Legal representative not found');
  }
}
