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
import { ContactRepsService } from './contactReps.service';
import {
  CreateContactRepDto,
  CreateContactRepSchema,
  UpdateContactRepDto,
} from './dtos/CreateContactRepDto';
import {
  QueryContactRepDto,
  QueryContactRepSchema,
} from './dtos/QueryContactRepDto';
import { FindContactRepsStrategy } from './strategies/find-contact-rep/find-contact-rep-strategy.enum';
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
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

@ApiTags('Contact representatives')
@Controller({
  path: 'contact-reps',
  version: '1',
})
export class ContactRepsController {
  constructor(private contactRepsService: ContactRepsService) {}

  // @UseGuards(RoleGuard)
  // @Roles([
  //   RoleEnum.ADMIN,
  //   RoleEnum.SALES,
  //   RoleEnum.CUSTOMER_SERVICE,
  //   RoleEnum.MANAGER,
  // ])
  @ApiOperation({ summary: 'Create new contact representative' })
  @ApiBody({
    type: CreateContactRepDto,
    examples: {
      example: {
        description: 'Example request payload for creating a new contact representative',
        value: {
          name: 'John Doe',
          phone: '1234567890',
          email: 'johndoe@example.com',
        },
      },
    },
  })
  @ApiCreatedResponse({ description: 'New contact representative created' })
  @ApiBadRequestResponse({ description: 'Invalid body' })
  @ApiConflictResponse({ description: 'Unique information already exist' })
  @ApiUnauthorizedResponse({
    description: 'Not logged in or account has unappropriate role',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong. Contact backend team at once',
  })
  
  @Post()
  async createContactReps(
    @Body(new ZodValidationPipe(CreateContactRepSchema)) 
    contactRepsData: CreateContactRepDto,
  ) {
    const createdContactRep = await this.contactRepsService.createContactReps(contactRepsData);
      return { message: 'Contact representative created successfully', data: createdContactRep };
  }

  // @UseGuards(RoleGuard)
  // @Roles([
  //   RoleEnum.ADMIN,
  //   RoleEnum.SALES,
  //   RoleEnum.CUSTOMER_SERVICE,
  //   RoleEnum.MANAGER,
  // ])
  @ApiOperation({ summary: "Update contact representative's information" })
  @ApiOkResponse({ description: 'New information updated' })
  @ApiBadRequestResponse({ description: 'Empty body or misspelled property' })
  @ApiNotFoundResponse({ description: 'Could not find contact representative to update' })
  @ApiUnauthorizedResponse({
    description: 'Not logged in or account has unappropriate role',
  })
  @ApiBody({
    type: UpdateContactRepDto,
    examples: {
      example: {
        description: 'Able to update one or more fields in CreateContactRepsDto',
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
  async updateContactReps(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(CreateContactRepSchema.partial())) 
    updateData: Partial<CreateContactRepDto>,
  ) {
    if (Object.keys(updateData).length === 0)
      throw new BadRequestException('Body is empty');
    const updateResponse = await this.contactRepsService.updateContactReps(
      id,
      updateData,
    );
    return {
      message: 'Contact representative updated successfully',
      data: updateResponse,
    };
  }

  // @UseGuards(RoleGuard)
  // @Roles([
  //   RoleEnum.ADMIN,
  //   RoleEnum.SALES,
  //   RoleEnum.CUSTOMER_SERVICE,
  //   RoleEnum.MANAGER,
  // ])
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
  @ApiOkResponse({ description: 'Contact representative found' })
  @ApiNotFoundResponse({ description: 'Contact representative not found' })
  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong. Contact backend team at once',
  })
  @ApiUnauthorizedResponse({
    description: 'Not logged in or account has unappropriate role',
  })

  @Get()
  async findContactReps(
    @Query(new ZodValidationPipe(QueryContactRepSchema)) query: QueryContactRepDto,
  ) {
    if (Object.keys(query).length === 0)
      return this.contactRepsService.findContactReps(FindContactRepsStrategy.ALL, '');

    const queryFields: { [key: string]: FindContactRepsStrategy } = {
      name: FindContactRepsStrategy.NAME,
      phone: FindContactRepsStrategy.PHONE,
      email: FindContactRepsStrategy.EMAIL,
    };

    for (const [key, strategy] of Object.entries(queryFields)) {
      const value = query[key as keyof QueryContactRepDto];
      if (value) {
        const contactRep = await this.contactRepsService.findContactReps(strategy, value);
        if (contactRep.length > 0) {
          if (strategy === FindContactRepsStrategy.ALL || contactRep.length > 1)
            return contactRep;
          else return [contactRep[0]];
        }
      }
    }

    throw new NotFoundException('Contact representative not found');
  }
}
