import { LegalRep } from '@/legalReps/models/legalReps.model';
import { Injectable } from '@nestjs/common';
import { IFindLegalRepsStrategy } from './find-legal-rep-strategy.interface';

@Injectable()
export class FindLegalRepsByPhoneStrategy implements IFindLegalRepsStrategy {
  async find(legalRepInfo: string): Promise<LegalRep[] | null> {
    return LegalRep.findAll({ where: { phone: legalRepInfo } });
  }
}
