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
import { LegalRepsService } from './legalReps.service';
import {
  CreateLegalRepDto,
  CreateLegalRepSchema,
} from './dtos/CreateLegalRepDto';
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
import {
  UpdateLegalRepDto,
  UpdateLegalRepSchema,
} from './dtos/UpdateLegalRepDto';
import { UpdateCustomerDto } from '@/customers/dtos/UpdateUserDto';
import { LegalRep } from './models/legalReps.model';
import {
  QueryLegalRepsDto,
  QueryLegalRepsSchema,
} from './dtos/QueryLegalRepsDto';
import { FindLegalRepsStrategy } from './strategies/find-legal-rep/find-legal-rep-strategy.enum';

@Controller({
  path: 'legalreps',
  version: '1',
})
export class LegalRepsController {
  constructor(private legalRepsService: LegalRepsService) {}
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

  @Patch(':id')
  async updateLegalReps(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateLegalRepSchema.partial()))
    updateData: Partial<UpdateLegalRepDto>,
  ) {
    const updateResponse = await this.legalRepsService.updateLegalReps(
      id,
      updateData,
    );
    return {
      message: 'Legal representative updated successfully',
      data: updateResponse,
    };
  }

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
