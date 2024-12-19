import { ContactRepFirmRep } from '@/contact-representatives-firm-representatives/models/contact-firm-representatives.model';
import { Injectable } from '@nestjs/common';
import { IFindContactRepFirmRepStrategy } from './find-contact-representatives-firm-representatives-strategy.interface';

@Injectable()
export class FindContactRepFirmRepByFirmRepStrategy implements IFindContactRepFirmRepStrategy {
  async find(firmRep_Id: string): Promise<ContactRepFirmRep[] | null> {
    return ContactRepFirmRep.findAll({where: {firmRepId: firmRep_Id}});
  }
}