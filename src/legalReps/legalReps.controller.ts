import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LegalRepsService } from './legalReps.service';
import {
  CreateLegalRepDto,
  CreateLegalRepSchema,
  UpdateLegalRepDto,
} from './dtos/CreateLegalRepDto';
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';

import {
  QueryLegalRepsDto,
  QueryLegalRepsSchema,
} from './dtos/QueryLegalRepsDto';
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
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UUIDV4 } from 'sequelize';

@ApiTags('Legal representatives')
@Controller({
  path: 'legal-reps',
  version: '1',
})
export class LegalRepsController {
  constructor(private legalRepsService: LegalRepsService) {}

  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.MANAGER])
  @ApiOperation({ summary: 'Create new customer' })
  @ApiBody({
    type: CreateLegalRepDto,
  })
  @ApiCreatedResponse({ description: 'New legalRep created' })
  @ApiBadRequestResponse({ description: 'Invalid body' })
  @ApiConflictResponse({ description: 'Unique information already exist' })
  @ApiUnauthorizedResponse({
    description: 'Not logged in or account has unappropriate role',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong. Contact backend team at once',
  })
  @Post()
  async createLegalReps(
    @Body(new ZodValidationPipe(CreateLegalRepSchema))
    legalRepsData: CreateLegalRepDto,
  ) {
    const createRes =
      await this.legalRepsService.createLegalReps(legalRepsData);
    return {
      message: 'Legal representative created successfully',
      data: createRes,
    };
  }

  // @UseGuards(RoleGuard)
  // @Roles([RoleEnum.ADMIN, RoleEnum.MANAGER])
  @ApiOperation({ summary: "Update customer's information" })
  @ApiOkResponse({ description: 'New information updated' })
  @ApiBadRequestResponse({ description: 'Empty body or misspelled property' })
  @ApiNotFoundResponse({ description: 'Could not find customer to update' })
  @ApiUnauthorizedResponse({
    description: 'Not logged in or account has unappropriate role',
  })
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
  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong. Contact backend team at once',
  })
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
    return {
      message: 'Legal representative updated successfully',
      data: updateResponse,
    };
  }

  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.MANAGER])
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
  @ApiQuery({
    name: 'customerId',
    type: String,
    required: false,
    description: "Search legalRep by their customer's id",
  })
  @ApiOkResponse({ description: 'legalRep found' })
  @ApiNotFoundResponse({ description: 'legalRep not found' })
  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong. Contact backend team at once',
  })
  @ApiUnauthorizedResponse({
    description: 'Not logged in or account has unappropriate role',
  })
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
