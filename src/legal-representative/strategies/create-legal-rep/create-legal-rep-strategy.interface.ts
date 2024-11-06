import { CreateLegalRepDto } from '@/legal-representative/dtos/create-legal-rep.dto';
import { LegalRep } from '@/legal-representative/models/legal-rep.model';

export interface ICreateLegalRepsStrategy {
  create(legalRepData: CreateLegalRepDto): Promise<LegalRep>;
}
