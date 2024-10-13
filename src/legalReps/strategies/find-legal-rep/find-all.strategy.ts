import { Injectable } from '@nestjs/common';
import { IFindLegalRepsStrategy } from './find-legal-rep-strategy.interface';
import { LegalRep } from '@/legalReps/models/legalReps.model';

@Injectable()
export class FindAllLegalRepsStrategy implements IFindLegalRepsStrategy {
  async find(): Promise<LegalRep[] | null> {
    return LegalRep.findAll();
  }
}
