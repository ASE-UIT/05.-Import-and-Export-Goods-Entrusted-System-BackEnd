import { ContactRepFirmRep } from '@/contact-representatives-firm-representatives/models/contact-firm-representatives.model';
import { Injectable } from '@nestjs/common';
import { IFindContactRepFirmRepStrategy } from './find-contact-representatives-firm-representatives-strategy.interface';

@Injectable()
export class FindContactRepFirmRepByContactRepStrategy implements IFindContactRepFirmRepStrategy {
  async find(contactRep_Id: string): Promise<ContactRepFirmRep[] | null> {
    return ContactRepFirmRep.findAll({where: {contactRepId: contactRep_Id}});
  }
}
