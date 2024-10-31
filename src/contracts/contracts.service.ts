import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateContractStrategy } from './strategies/create-contract/create-contract.strategy';
import { CreateContractDto } from './dtos/CreateContractDto';
import { Contract } from './models/contract.model';
import { FindContractByIdStrategy } from './strategies/find-contract/find-by-id.strategy';
import { FindContractByStartDateStrategy } from './strategies/find-contract/find-by-start-date.strategy';
import { FindContractByEndDateStrategy } from './strategies/find-contract/find-by-end-date.strategy';
import { FindContractByStatusStrategy } from './strategies/find-contract/find-by-status.strategy';
import { FindContractByContractDateStrategy } from './strategies/find-contract/find-by-contract-date.strategy';
import { FindContractByEmployeeIdStrategy } from './strategies/find-contract/find-by-employee-id.strategy';
import { FindContractByQuotationIdStrategy } from './strategies/find-contract/find-by-quotation-id.strategy';
import { UpdateContractStrategy } from './strategies/update-contract/update-contract.strategy';
import { FindAllContractStrategy } from './strategies/find-contract/find-all.strategy';
import { FindContractStrategy } from './strategies/find-contract/find-contract-strategy.enum';
import { IFindContractStrategy } from './strategies/find-contract/find-contract-strategy.interface';

@Injectable()
export class ContractsService {
  constructor(
    private findAllConTractStrategy: FindAllContractStrategy,
    private findContractByIdStrategy: FindContractByIdStrategy,
    private findContractByStartDateStrategy: FindContractByStartDateStrategy,
    private findContractByEndDateStrategy: FindContractByEndDateStrategy,
    private findContractByStatusStrategy: FindContractByStatusStrategy,
    private findContractByContractDateStrategy: FindContractByContractDateStrategy,
    private findContractByEmployeeIdStrategy: FindContractByEmployeeIdStrategy,
    private findContractByQuotationIdStrategy: FindContractByQuotationIdStrategy,
    private createContractStrategy: CreateContractStrategy,
    private updateContractStrategy: UpdateContractStrategy,
  ) {}

  async create(contractInfo: CreateContractDto): Promise<Contract> {
    const createdContract =
      await this.createContractStrategy.create(contractInfo);
    return createdContract;
  }

  find(strategy: FindContractStrategy, contractInfo: any): Promise<Contract[]> {
    const findStrategy = this.getFindStrategy(strategy);
    const contract = findStrategy.find(contractInfo);
    return contract;
  }

  getFindStrategy(strategy: FindContractStrategy): IFindContractStrategy {
    switch (strategy) {
      case FindContractStrategy.ALL:
        return this.findAllConTractStrategy;
      case FindContractStrategy.ID:
        return this.findContractByIdStrategy;
      case FindContractStrategy.CONTRACT_DATE:
        return this.findContractByContractDateStrategy;
      case FindContractStrategy.STATUS:
        return this.findContractByStatusStrategy;
      case FindContractStrategy.START_DATE:
        return this.findContractByStartDateStrategy;
      case FindContractStrategy.END_DATE:
        return this.findContractByEndDateStrategy;
      case FindContractStrategy.QUOTATION_ID:
        return this.findContractByQuotationIdStrategy;
      case FindContractStrategy.EMPLOYEE_ID:
        return this.findContractByEmployeeIdStrategy;
    }
  }

  async update(
    contractID: string,
    updateInfo: Partial<CreateContractDto>,
  ): Promise<Contract> {
    if (Object.keys(updateInfo).length < 1) {
      throw new BadRequestException('Body is empty');
    }
    const updatedResponse = await this.updateContractStrategy.update(
      contractID,
      updateInfo,
    );
    return updatedResponse;
  }
}
