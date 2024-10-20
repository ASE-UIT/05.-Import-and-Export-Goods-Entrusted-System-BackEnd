import { ContactRep } from '@/contactReps/models/contactReps.model';
import { Injectable } from '@nestjs/common';
import { IFindContactRepsStrategy } from './find-contact-rep-strategy.interface';

@Injectable()
export class FindContactRepsByPhoneStrategy implements IFindContactRepsStrategy {
  async find(contactRepPhone: string): Promise<ContactRep[] | null> {
    return ContactRep.findAll({ where: { phone: contactRepPhone } });
  }
}