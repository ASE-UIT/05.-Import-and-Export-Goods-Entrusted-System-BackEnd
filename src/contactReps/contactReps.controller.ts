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
} from '@nestjs/common';
import { ContactRepsService } from './contactReps.service';
import {
  CreateContactRepDto,
  CreateContactRepSchema,
} from './dtos/CreateContactRepDto';
import {
  QueryContactRepDto,
  QueryContactRepSchema,
} from './dtos/QueryContactRepDto';
import { FindContactRepsStrategy } from './strategies/find-contact-rep/find-contact-rep-strategy.enum';
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
import { ContactRep } from './models/contactReps.model';

@Controller({
  path: 'contact-reps',
  version: '1',
})
export class ContactRepsController {
  constructor(private contactRepsService: ContactRepsService) { }

  @Post()
  async createContactReps(
    @Body(new ZodValidationPipe(CreateContactRepSchema)) body: CreateContactRepDto,
  ): Promise<{ message: string; data: ContactRep }> {
    try {
      const createdContactRep = await this.contactRepsService.create(body);
      return { message: 'Contact representative created', data: createdContactRep };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch(':id')
  async updateContactReps(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(CreateContactRepSchema.partial())) body: Partial<CreateContactRepDto>,
  ): Promise<{ message: string; data: ContactRep }> {
    try {
      const updatedContactRep = await this.contactRepsService.update(id, body);
      return { message: 'Contact representative updated', data: updatedContactRep };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  async findContactReps(
    @Query(new ZodValidationPipe(QueryContactRepSchema)) query: QueryContactRepDto,
  ): Promise<ContactRep[]> {
    if (Object.keys(query).length === 0)
      return this.contactRepsService.find(FindContactRepsStrategy.ALL, '');

    const queryFields: { [key: string]: FindContactRepsStrategy } = {
      name: FindContactRepsStrategy.NAME,
      phone: FindContactRepsStrategy.PHONE,
      email: FindContactRepsStrategy.EMAIL,
    };

    for (const [key, strategy] of Object.entries(queryFields)) {
      const value = query[key as keyof QueryContactRepDto];
      if (value) {
        const contactRep = await this.contactRepsService.find(strategy, value);
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
