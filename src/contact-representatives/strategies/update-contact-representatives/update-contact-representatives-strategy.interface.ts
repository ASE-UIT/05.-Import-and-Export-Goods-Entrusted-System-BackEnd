import { CreateContactRepDto } from '@/contact-representatives/dtos/create-contact-representatives.dto';
import { ContactRep } from '@/contact-representatives/models/contact-representatives.model';

export interface IUpdateContactRepsStrategy {
  update(contactRepId: string, updateData: Partial<CreateContactRepDto>,): Promise<ContactRep>;
}