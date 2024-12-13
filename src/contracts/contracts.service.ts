import {
  BadRequestException,
  ConflictException,
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
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@/users/models/user.model';
import { ForeignKeyConstraintError, UniqueConstraintError } from 'sequelize';

@Injectable()
export class ContractsService {
  constructor(
    @InjectModel(Contract)
    private contractModel: typeof Contract,
    @InjectModel(User)
    private userModel: typeof User,
    private createContractStrategy: CreateContractStrategy,
    private updateContractStrategy: UpdateContractStrategy,
    private findContractStrategy: FindContractStrategy,
  ) {}

  async create(body: CreateContractDto): Promise<Contract> {
    const userExist = await this.userModel.findByPk(body.userId);
    if (!userExist) {
      throw new NotFoundException('User not found for the provided userId');
    }

    try {
      const contract = await this.contractModel.create({
        startDate: body.startDate,
        endDate: body.endDate,
        status: body.status,
        contractDate: body.contractDate,
        userId: body.userId,
        quotationId: body.quotationId,
      });
      return contract;
    } catch (err) {
      if (err instanceof ForeignKeyConstraintError) {
        throw new ConflictException('Quotation Id not found or invalid');
      }
      if (err instanceof UniqueConstraintError) {
        throw new ConflictException('Duplicate contract information');
      }
      throw err;
    }
  }

  async find(contractInfo: QueryContractDto): Promise<Contract[]> {
    const foundContract = await this.findContractStrategy.find(contractInfo);
    if (foundContract.length > 0) return foundContract;
    else throw new NotFoundException('Contract not found'); 
  }

  async findUserContract(userId: string): Promise<Contract[]> {
    const contracts = await this.contractModel.findAll({ where: { userId } });
    if (!contracts || contracts.length === 0) {
      throw new NotFoundException('No contracts found for the provided userId');
    }
    return contracts;
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
