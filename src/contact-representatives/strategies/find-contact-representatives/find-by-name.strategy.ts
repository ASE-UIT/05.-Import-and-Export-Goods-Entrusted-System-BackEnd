import { ContactRep } from '@/contact-representatives/models/contact-representatives.model';
import { Injectable } from '@nestjs/common';
import { IFindContactRepsStrategy } from './find-contact-representatives-strategy.interface';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class FindContactRepsByNameStrategy implements IFindContactRepsStrategy {
  async find(contactRepName: string): Promise<ContactRep[] | null> {
    return ContactRep.findAll({ where: { name: contactRepName } });
  }
}