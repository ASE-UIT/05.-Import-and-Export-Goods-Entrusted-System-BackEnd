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
import { UpdateContractStrategy } from './strategies/update-contract/update-contract.strategy';
import { QueryContractDto } from './dtos/query-contract.dto';
import { FindContractStrategy } from './strategies/find-contract/find-contract.strategy';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@/users/models/user.model';
import { ForeignKeyConstraintError, UniqueConstraintError } from 'sequelize';
import { Quotation } from '@/quotations/models/quotations.model';

@Injectable()
export class ContractsService {
  constructor(
    @InjectModel(Contract)
    private contractModel: typeof Contract,
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Quotation)
    private quotationModel: typeof Quotation,
    private createContractStrategy: CreateContractStrategy,
    private updateContractStrategy: UpdateContractStrategy,
    private findContractStrategy: FindContractStrategy,
  ) {}

  async create(body: CreateContractDto): Promise<Contract> {
    const quotation = await this.quotationModel.findOne({
      where: { id: body.quotationId },
    });
    if (!quotation)
      throw new NotFoundException('Quotation with given id not found');

    try {
      const contract = await this.contractModel.create({
        startDate: body.startDate,
        endDate: body.endDate,
        status: body.status,
        contractDate: body.contractDate,
        userId: quotation.userId,
        quotationId: body.quotationId,
        employeeId: body.employeeId,
      });
      return contract;
    } catch (err) {
      if (err instanceof ForeignKeyConstraintError) {
        throw new ConflictException('Employee with given id not found');
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
