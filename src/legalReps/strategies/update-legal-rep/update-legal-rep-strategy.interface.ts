import { UpdateLegalRepDto } from '@/legalReps/dtos/UpdateLegalRepDto';
import { LegalRep } from '@/legalReps/models/legalReps.model';

export interface IUpdateLegalRepsStrategy {
  update(legalRepId: string, updateData: UpdateLegalRepDto): Promise<LegalRep>;
}
