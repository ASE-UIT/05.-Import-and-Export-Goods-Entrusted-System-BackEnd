import { ConflictException, Injectable } from '@nestjs/common';
import { ICreateContactRepsStrategy } from './create-contact-rep-strategy.interface';
import { CreateContactRepDto } from '@/contactReps/dtos/CreateContactRepDto';
import { ContactRep } from '@/contactReps/models/contactReps.model';
import { UniqueConstraintError } from 'sequelize';

@Injectable()
export class CreateContactRepsStrategy implements ICreateContactRepsStrategy {
  async create(contactRepData: CreateContactRepDto): Promise<ContactRep> {
    const contactRep = new ContactRep();
    contactRep.name = contactRepData.name;
    contactRep.email = contactRepData.email;
    contactRep.phone = contactRepData.phone;
    contactRep.providerId = contactRepData.providerId;

    try {
      await contactRep.save();
      return contactRep;
    }
    catch(err) {
      if (err instanceof UniqueConstraintError) {
        throw new ConflictException(err.errors[0].message);
      }
    }
  }
}