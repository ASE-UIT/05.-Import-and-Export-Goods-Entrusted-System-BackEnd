import { CreateLegalRepDto } from '@/legalReps/dtos/CreateLegalRepDto';
import { LegalRep } from '@/legalReps/models/legalReps.model';

export interface ICreateLegalRepsStrategy {
  create(legalRepData: CreateLegalRepDto): Promise<LegalRep>;
}
