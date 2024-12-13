import { CreateContactRepFirmRepDto } from '@/contact-representatives-firm-representatives/dtos/create-contact-firm-representatives.dto';
import { ContactRepFirmRep } from '@/contact-representatives-firm-representatives/models/contact-firm-representatives.model';

export interface IUpdateContactRepFirmRepStrategy {
  update(
    id: string,
    updateData: Partial<CreateContactRepFirmRepDto>,
  ): Promise<ContactRepFirmRep>;
}
