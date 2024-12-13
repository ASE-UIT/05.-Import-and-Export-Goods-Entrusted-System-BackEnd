import { ContactRep } from '@/contact-representatives/models/contact-representatives.model';
import { Injectable } from '@nestjs/common';
import { IFindContactRepsStrategy } from './find-contact-representatives-strategy.interface';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class FindContactRepsByProviderIdStrategy implements IFindContactRepsStrategy {
  async find(providerId: string): Promise<ContactRep[] | null> {
    return ContactRep.findAll({ where: { provider_id: providerId }, });
  }
}