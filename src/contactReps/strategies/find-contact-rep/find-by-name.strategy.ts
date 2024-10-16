import { ContactRep } from '@/contactReps/models/contactReps.model';
import { Injectable } from '@nestjs/common';
import { IFindContactRepsStrategy } from './find-contact-rep-strategy.interface';

@Injectable()
export class FindContactRepsByNameStrategy implements IFindContactRepsStrategy {
  async find(contactRepName: string): Promise<ContactRep[] | null> {
    return ContactRep.findAll({ where: { name: contactRepName } });
  }
}