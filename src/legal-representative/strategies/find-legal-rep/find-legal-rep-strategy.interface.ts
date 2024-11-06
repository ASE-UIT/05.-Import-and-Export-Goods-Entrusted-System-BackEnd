import { LegalRep } from '@/legal-representative/models/legal-rep.model';

export interface IFindLegalRepsStrategy {
  find(legalRepInfo: string): Promise<LegalRep[] | null>;
}
