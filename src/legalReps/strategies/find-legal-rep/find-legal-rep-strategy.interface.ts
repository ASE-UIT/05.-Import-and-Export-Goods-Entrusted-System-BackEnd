import { LegalRep } from '@/legalReps/models/legalReps.model';

export interface IFindLegalRepsStrategy {
  find(legalRepInfo: string): Promise<LegalRep[] | null>;
}
