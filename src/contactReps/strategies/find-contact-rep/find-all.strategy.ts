import { Injectable } from '@nestjs/common';
import { ContactRep } from '@/contactReps/models/contactReps.model';
import { IFindContactRepsStrategy } from './find-contact-rep-strategy.interface';

@Injectable()
export class FindAllContactRepsStrategy implements IFindContactRepsStrategy{
  async find(): Promise<ContactRep[] | null> {
    return ContactRep.findAll();
  }
}
