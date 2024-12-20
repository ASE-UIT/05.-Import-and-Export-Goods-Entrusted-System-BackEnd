import { ContactRepFirmRep } from '@/contact-representatives-firm-representatives/models/contact-firm-representatives.model';

export interface IFindContactRepFirmRepStrategy {
  find(contactRepFirmRepInfo: string | any): Promise<ContactRepFirmRep[] | null>;
}
