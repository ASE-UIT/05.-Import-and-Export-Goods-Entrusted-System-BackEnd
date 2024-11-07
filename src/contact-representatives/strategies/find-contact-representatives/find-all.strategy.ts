import { Injectable } from '@nestjs/common';
import { ContactRep } from '@/contact-representatives/models/contact-representatives.model';
import { IFindContactRepsStrategy } from './find-contact-representatives-strategy.interface';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class FindAllContactRepsStrategy implements IFindContactRepsStrategy{
  async find(): Promise<ContactRep[] | null> {
    return ContactRep.findAll();
  }
}
