import { Injectable } from '@nestjs/common';
import { ContactRep } from '@/contactReps/models/contactReps.model';

@Injectable()
export class FindAllContactRepsStrategy {
  async find(): Promise<ContactRep[] | null> {
    return ContactRep.findAll();
  }
}
