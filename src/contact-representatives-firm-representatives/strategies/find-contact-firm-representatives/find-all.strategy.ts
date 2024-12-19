import { Injectable } from '@nestjs/common';
import { IFindContactRepFirmRepStrategy } from './find-contact-representatives-firm-representatives-strategy.interface';
import { ContactRepFirmRep } from '@/contact-representatives-firm-representatives/models/contact-firm-representatives.model';

@Injectable()
export class FindAllContactRepFirmRepStrategy implements IFindContactRepFirmRepStrategy{
  async find(): Promise<ContactRepFirmRep[] | null> {
    return ContactRepFirmRep.findAll();
  }
}