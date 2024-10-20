import { ContactRep } from '@/contactReps/models/contactReps.model';
import { Injectable } from '@nestjs/common';
import { IFindContactRepsStrategy } from './find-contact-rep-strategy.interface';

@Injectable()
export class FindContactRepsByEmailStrategy implements IFindContactRepsStrategy {
  async find(contactRepEmail: string): Promise<ContactRep[] | null> {
    return ContactRep.findAll({ where: { email: contactRepEmail } });
  }
}