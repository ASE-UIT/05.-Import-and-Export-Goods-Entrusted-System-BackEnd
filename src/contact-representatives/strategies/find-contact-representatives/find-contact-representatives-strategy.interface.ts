import { ContactRep } from '@/contact-representatives/models/contact-representatives.model';

export interface IFindContactRepsStrategy {
  find(contactRepInfo: string): Promise<ContactRep[] | null>;
}
