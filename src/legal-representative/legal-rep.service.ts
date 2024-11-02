import { Injectable } from '@nestjs/common';
import { CreateLegalRepsStrategy } from './strategies/create-legal-rep/create-legal-rep.strategy';
import { CreateLegalRepDto } from './dtos/create-legal-rep.dto';
import { LegalRep } from './models/legal-rep.model';
import { UpdateLegalRepsStrategy } from './strategies/update-legal-rep/update-legal-rep.strategy';
import { FindLegalRepsByCustomerIdStrategy } from './strategies/find-legal-rep/find-by-customer-id.strategy';
import { FindLegalRepsByEmailStrategy } from './strategies/find-legal-rep/find-by-email.strategy';
import { FindLegalRepsByNameStrategy } from './strategies/find-legal-rep/find-by-name.strategy';
import { FindLegalRepsByPhoneStrategy } from './strategies/find-legal-rep/find-by-phone.strategy';
import { FindAllLegalRepsStrategy } from './strategies/find-legal-rep/find-all.strategy';
import { FindLegalRepsStrategy } from './strategies/find-legal-rep/find-legal-rep-strategy.enum';

@Injectable()
export class LegalRepsService {
  constructor(
    private createLegalRepStrategy: CreateLegalRepsStrategy,
    private updateLegalRepsStrategy: UpdateLegalRepsStrategy,
    private findLegalRepsByCustomerIdStrategy: FindLegalRepsByCustomerIdStrategy,
    private findLegalRepsByEmailStrategy: FindLegalRepsByEmailStrategy,
    private findLegalRepsByNameStrategy: FindLegalRepsByNameStrategy,
    private findLegalRepsByPhoneStrategy: FindLegalRepsByPhoneStrategy,
    private findAllLegalRepsStrategy: FindAllLegalRepsStrategy,
  ) {}

  //creating services
  async createLegalReps(legalRepData: CreateLegalRepDto): Promise<LegalRep> {
    return await this.createLegalRepStrategy.create(legalRepData);
  }

  //updating services
  async updateLegalReps(legalRepId: string, updateData: CreateLegalRepDto) {
    return await this.updateLegalRepsStrategy.update(legalRepId, updateData);
  }

  //finding services
  getFindStrategy(strategy: FindLegalRepsStrategy) {
    switch (strategy) {
      case FindLegalRepsStrategy.ALL:
        return this.findAllLegalRepsStrategy;
      case FindLegalRepsStrategy.NAME:
        return this.findLegalRepsByNameStrategy;
      case FindLegalRepsStrategy.EMAIL:
        return this.findLegalRepsByEmailStrategy;
      case FindLegalRepsStrategy.PHONE:
        return this.findLegalRepsByPhoneStrategy;
      case FindLegalRepsStrategy.CUSTOMER_ID:
        return this.findLegalRepsByCustomerIdStrategy;
    }
  }
  async findLegalReps(
    strategy: FindLegalRepsStrategy,
    legalRepInfo: string,
  ): Promise<LegalRep[] | null> {
    const findStrategy = this.getFindStrategy(strategy);
    const legalRep: LegalRep[] | null = await findStrategy.find(legalRepInfo);
    return legalRep;
  }
}
