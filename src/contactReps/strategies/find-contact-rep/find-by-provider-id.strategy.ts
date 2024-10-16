import { ContactRep } from '@/contactReps/models/contactReps.model';
import { Injectable } from '@nestjs/common';
import { IFindContactRepsStrategy } from './find-contact-rep-strategy.interface';

@Injectable()
export class FindContactRepsByProviderIdStrategy implements IFindContactRepsStrategy {
  async find(contactRepProviderId: string): Promise<ContactRep[] | null> {
    return ContactRep.findAll({ where: { providerId: contactRepProviderId } });
  }
}
