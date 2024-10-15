import { CreateLegalRepDto } from '@/legalReps/dtos/CreateLegalRepDto';
import { LegalRep } from '@/legalReps/models/legalReps.model';

export interface IUpdateLegalRepsStrategy {
  update(
    legalRepId: string,
    updateData: Partial<CreateLegalRepDto>,
  ): Promise<LegalRep>;
}
