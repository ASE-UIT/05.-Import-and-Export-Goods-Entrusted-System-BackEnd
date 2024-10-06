import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLegalRepsStrategy } from './strategies/create-legal-rep/create-legal-rep.strategy';
import { CreateLegalRepDto } from './dtos/CreateLegalRepDto';
import { Customer } from '@/customers/models/customer.model';
import { Not } from 'sequelize-typescript';
import { LegalRep } from './models/legalReps.model';
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
  async createLegalReps(legalRepData: CreateLegalRepDto): Promise<void> {
    const customerExists = await this.checkCustomer(legalRepData.customerId);
    const legalRepExists = await this.checkDuplicate(legalRepData.name);
    if (!customerExists) {
      throw new NotFoundException('Customer not found');
    }
    if (legalRepExists) {
      throw new ConflictException('Legal representative already exists');
    }
    return await this.createLegalRepStrategy.create(legalRepData);
  }
  async checkCustomer(customerId: string): Promise<boolean> {
    const exists = await Customer.findOne({ where: { id: customerId } });
    return exists ? true : false;
  }
  async checkDuplicate(name: string): Promise<boolean> {
    const exists = await LegalRep.findOne({ where: { name: name } });
    return exists ? true : false;
  }

  //updating services
  async updateLegalReps(legalRepId: string, updateData: CreateLegalRepDto) {
    if (Object.keys(updateData).length < 1)
      throw new BadRequestException('Body is empty');
    const legalRepExists = await this.checkLegalRep(legalRepId);
    if (!legalRepExists) {
      throw new NotFoundException('Legal representative not found');
    }
    return await this.updateLegalRepsStrategy.update(legalRepId, updateData);
  }
  async checkLegalRep(id: string): Promise<boolean> {
    const exists = await LegalRep.findOne({ where: { id: id } });
    return exists ? true : false;
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
