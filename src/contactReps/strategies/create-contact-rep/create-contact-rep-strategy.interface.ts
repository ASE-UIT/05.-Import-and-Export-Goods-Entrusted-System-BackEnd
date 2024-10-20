import { CreateContactRepDto } from '@/contactReps/dtos/CreateContactRepDto';
import { ContactRep } from '@/contactReps/models/contactReps.model';

export interface ICreateContactRepsStrategy {
  create(contactRepData: CreateContactRepDto): Promise<ContactRep>;
}
