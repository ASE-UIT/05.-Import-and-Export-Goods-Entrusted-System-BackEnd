import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLegalRepsStrategy } from './strategies/create-legal-rep/create-legal-rep.strategy';
import {
  CreateLegalRepDto,
  UpdateLegalRepDto,
} from './dtos/create-legal-rep.dto';
import { LegalRep } from './models/legal-rep.model';
import { UpdateLegalRepsStrategy } from './strategies/update-legal-rep/update-legal-rep.strategy';
import { QueryLegalRepsDto } from './dtos/query-legal-rep.dto';

@Injectable()
export class LegalRepsService {
  constructor(
    private createLegalRepStrategy: CreateLegalRepsStrategy,
    private updateLegalRepsStrategy: UpdateLegalRepsStrategy,
  ) {}

  //creating services
  async createLegalReps(legalRepData: CreateLegalRepDto): Promise<LegalRep> {
    return await this.createLegalRepStrategy.create(legalRepData);
  }

  //updating services
  async updateLegalReps(legalRepId: string, updateData: UpdateLegalRepDto) {
    return await this.updateLegalRepsStrategy.update(legalRepId, updateData);
  }

  async findLegalReps(query: QueryLegalRepsDto): Promise<LegalRep[]> {
    let legalRep: LegalRep[];
    if (query) legalRep = await LegalRep.findAll({ where: query });
    else legalRep = await LegalRep.findAll();

    if (legalRep.length > 0) return legalRep;
    else throw new NotFoundException('Legal representative not found');
  }
}
