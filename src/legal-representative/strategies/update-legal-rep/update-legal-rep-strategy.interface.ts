import { CreateLegalRepDto } from '@/legal-representative/dtos/create-legal-rep.dto';
import { LegalRep } from '@/legal-representative/models/legal-rep.model';

export interface IUpdateLegalRepsStrategy {
  update(
    legalRepId: string,
    updateData: Partial<CreateLegalRepDto>,
  ): Promise<LegalRep>;
}
