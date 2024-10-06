import { CreateLegalRepDto } from '@/legalReps/dtos/CreateLegalRepDto';

export interface ICreateLegalRepsStrategy {
  create(legalRepData: CreateLegalRepDto): Promise<void>;
}
