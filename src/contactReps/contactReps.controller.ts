import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ContactRepsService } from './contactReps.service';
import {
  CreateContactRepDto,
  CreateContactRepSchema,
} from './dtos/CreateContactRepDto';
import { UpdateCustomerDto } from '@/customers/dtos/UpdateUserDto';
import { ContactRep } from './models/contactReps.model';
import {
  QueryContactRepDto,
  QueryContactRepSchema,
} from './dtos/QueryContactRepDto';
import { FindContactRepsStrategy } from './strategies/find-contact-rep/find-contact-rep-strategy.enum';
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';

@Controller({
  path: 'contactreps',
  version: '1',
})
export class ContactRepsController {
  constructor(private contactRepsService: ContactRepsService) {}
  @Post()
  async createContactReps(
    @Body(new ZodValidationPipe(CreateContactRepSchema))
    contactRepsData: CreateContactRepDto,
  ) {
    const createRes =
      await this.contactRepsService.createContactReps(contactRepsData);
    return {
      message: 'Contact representative created successfully',
      data: createRes,
    };
  }

  @Patch(':id')
  async updateContactReps(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(CreateContactRepSchema.partial()))
    updateData: Partial<CreateContactRepDto>,
  ) {
    const updateResponse = await this.contactRepsService.updateContactReps(
      id,
      updateData,
    );
    return {
      message: 'Contact representative updated successfully',
      data: updateResponse,
    };
  }

  @Get()
  async findContactReps(
    @Query(new ZodValidationPipe(QueryContactRepSchema))
    query: QueryContactRepDto,
  ) {
    if (Object.keys(query).length === 0)
      return await this.contactRepsService.findContactReps(
        FindContactRepsStrategy.ALL,
        '',
      );

    const queryFields: { [key: string]: FindContactRepsStrategy } = {
      name: FindContactRepsStrategy.NAME,
      customerId: FindContactRepsStrategy.PROVIDER_ID,
      phone: FindContactRepsStrategy.PHONE,
      email: FindContactRepsStrategy.EMAIL,
    };

    // Assign corrisponding strategy to query fields
    for (const [key, strategy] of Object.entries(queryFields)) {
      const value = query[key as keyof QueryContactRepDto];
      if (value) {
        const customer = await this.contactRepsService.findContactReps(
          strategy,
          value,
        );
        if (customer.length > 0) {
          if (strategy === FindContactRepsStrategy.ALL || customer.length > 1)
            return customer;
          else return customer[0];
        }
      }
    }

    // Cant find customer
    throw new NotFoundException('Contact representative not found');
  }
}
