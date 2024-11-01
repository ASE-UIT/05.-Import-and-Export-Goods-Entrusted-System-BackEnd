import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ICreateContactRepsStrategy } from './create-contact-rep-strategy.interface';
import { CreateContactRepDto } from '@/contactReps/dtos/CreateContactRepDto';
import { ContactRep } from '@/contactReps/models/contactReps.model';
import { ForeignKeyConstraintError, UniqueConstraintError } from 'sequelize';
import { Provider } from '@/providers/models/provider.model';


@Injectable()
export class CreateContactRepsStrategy implements ICreateContactRepsStrategy {
  async create(contactRepData: CreateContactRepDto): Promise<ContactRep> {
    const contactRep = new ContactRep();
    contactRep.name = contactRepData.name;
    contactRep.email = contactRepData.email;
    contactRep.phone = contactRepData.phone;
    try {
      await contactRep.save();
      return contactRep;
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        throw new ConflictException(err.errors[0].message);
      }
    }
  }
}