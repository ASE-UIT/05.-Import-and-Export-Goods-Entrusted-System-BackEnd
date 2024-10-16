import { ContactRep } from '@/contactReps/models/contactReps.model';

export interface IFindContactRepsStrategy {
  find(contactRepInfo: string): Promise<ContactRep[] | null>;
}
