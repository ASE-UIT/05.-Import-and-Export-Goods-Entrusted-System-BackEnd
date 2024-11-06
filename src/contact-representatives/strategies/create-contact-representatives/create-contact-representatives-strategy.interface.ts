import { CreateContactRepDto } from '@/contact-representatives/dtos/create-contact-representatives.dto';
import { ContactRep } from '@/contact-representatives/models/contact-representatives.model';

export interface ICreateContactRepsStrategy {
  create(contactRepData: CreateContactRepDto): Promise<ContactRep>;
}
