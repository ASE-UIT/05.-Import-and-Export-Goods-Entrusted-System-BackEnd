import { Injectable } from '@nestjs/common';
import { IFindLegalRepsStrategy } from './find-legal-rep-strategy.interface';
import { LegalRep } from '@/legal-representative/models/legal-rep.model';

@Injectable()
export class FindLegalRepsByNameStrategy implements IFindLegalRepsStrategy {
  async find(legalRepInfo: string): Promise<LegalRep[] | null> {
    return LegalRep.findAll({ where: { name: legalRepInfo } });
  }
}
