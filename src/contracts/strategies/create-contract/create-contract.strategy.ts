import { CreateContractDto } from '@/contracts/dtos/create-contract.dto';
import { Contract } from '@/contracts/models/contract.model';
import { ICreateContractStrategy } from './create-contract-strategy.interface';
import { InjectModel } from '@nestjs/sequelize';
import { ConflictException } from '@nestjs/common';
import { ValidationError } from '@/shared/classes/validation-error.class';
import { ForeignKeyConstraintError } from 'sequelize';

export class CreateContractStrategy implements ICreateContractStrategy {
  constructor(
    @InjectModel(Contract)
    private contractModel: typeof Contract,
  ) {}
  async create(strategyInfo: CreateContractDto): Promise<Contract> {
    try {
      const contract = this.contractModel.create({
        startDate: strategyInfo.startDate,
        endDate: strategyInfo.endDate,
        status: strategyInfo.status,
        contractDate: strategyInfo.contractDate,
        employeeId: strategyInfo.employeeId,
        quotationId: strategyInfo.quotationId,
      });
      return contract;
    } catch (err) {
      if (err instanceof ForeignKeyConstraintError) {
        throw new ConflictException('Employee Id or Quotation Id not found');
      }
    }
  }
}
