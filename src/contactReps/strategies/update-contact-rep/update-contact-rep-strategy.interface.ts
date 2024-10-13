import { CreateContactRepDto } from '@/contactReps/dtos/CreateContactRepDto';
import { ContactRep } from '@/contactReps/models/contactReps.model';

export interface IUpdateContactRepsStrategy {
  update(contactRepId: string, updateData: CreateContactRepDto): Promise<ContactRep>;
}