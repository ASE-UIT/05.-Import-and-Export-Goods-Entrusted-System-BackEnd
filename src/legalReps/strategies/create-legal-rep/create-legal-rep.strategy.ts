import { Injectable } from '@nestjs/common';
import { ICreateLegalRepsStrategy } from './create-legal-rep-strategy.interface';
import { CreateLegalRepDto } from '@/legalReps/dtos/CreateLegalRepDto';
import { LegalRep } from '@/legalReps/models/legalReps.model';
import { UniqueConstraintError } from 'sequelize';

@Injectable()
export class CreateLegalRepsStrategy implements ICreateLegalRepsStrategy {
  async create(legalRepData: CreateLegalRepDto): Promise<LegalRep> {
    const legalRep = new LegalRep();
    legalRep.name = legalRepData.name;
    legalRep.email = legalRepData.email;
    legalRep.phone = legalRepData.phone;
    legalRep.customerId = legalRepData.customerId;
    await legalRep.save();
    return legalRep;
  }
}
