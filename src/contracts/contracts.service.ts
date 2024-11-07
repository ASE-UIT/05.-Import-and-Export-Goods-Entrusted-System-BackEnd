import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateContractStrategy } from './strategies/create-contract/create-contract.strategy';
import { CreateContractDto } from './dtos/create-contract.dto';
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
import { IFindContractStrategy } from './strategies/find-contract/find-contract-strategy.interface';
import { QueryContractDto } from './dtos/query-contract.dto';
import { FindContractStrategy } from './strategies/find-contract/find-contract.strategy';

@Injectable()
export class ContractsService {
  constructor(
    private createContractStrategy: CreateContractStrategy,
    private updateContractStrategy: UpdateContractStrategy,
    private findContractStrategy: FindContractStrategy,
  ) {}

  async create(contractInfo: CreateContractDto): Promise<Contract> {
    const createdContract =
      await this.createContractStrategy.create(contractInfo);
    return createdContract;
  }

  async find(contractInfo: QueryContractDto): Promise<Contract[]> {
    const foundContract = await this.findContractStrategy.find(contractInfo);
    if (foundContract.length > 0) return foundContract;
    else throw new NotFoundException('Contract not found');
  }

  async update(
    contractID: string,
    updateInfo: Partial<CreateContractDto>,
  ): Promise<Contract> {
    if (Object.keys(updateInfo).length < 1) {
      throw new BadRequestException('Body is empty or invalid field names');
    }
    const updatedResponse = await this.updateContractStrategy.update(
      contractID,
      updateInfo,
    );
    return updatedResponse;
  }
}
