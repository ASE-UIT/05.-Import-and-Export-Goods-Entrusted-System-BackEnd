import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ICreateLegalRepsStrategy } from './create-legal-rep-strategy.interface';
import { CreateLegalRepDto } from '@/legalReps/dtos/CreateLegalRepDto';
import { LegalRep } from '@/legalReps/models/legalReps.model';
import { ForeignKeyConstraintError, UniqueConstraintError } from 'sequelize';
import { Customer } from '@/customers/models/customer.model';

@Injectable()
export class CreateLegalRepsStrategy implements ICreateLegalRepsStrategy {
  async create(legalRepData: CreateLegalRepDto): Promise<LegalRep> {
    const legalRep = new LegalRep();

    legalRep.name = legalRepData.name;
    legalRep.email = legalRepData.email;
    legalRep.phone = legalRepData.phone;
    const customer = await Customer.findOne({
      where: { id: legalRepData.customerId },
    });
    try {
      await legalRep.save();
      if (customer) customer.legalRepId = legalRep.id;
      await customer.save();
      return legalRep;
    } catch (err) {
      if (err instanceof ForeignKeyConstraintError) {
        console.log(err.message);
        throw new NotFoundException('Could not find customer to represent');
      }
      if (err instanceof UniqueConstraintError) {
        throw new ConflictException(err.errors[0].message);
      }
    }
  }
}
