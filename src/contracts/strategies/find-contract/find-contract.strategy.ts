import { Injectable } from '@nestjs/common';
import { IFindContractStrategy } from './find-contract-strategy.interface';
import { Contract } from '@/contracts/models/contract.model';
import { InjectModel } from '@nestjs/sequelize';
import { QueryContractDto } from '@/contracts/dtos/query-contract.dto';

@Injectable()
export class FindContractStrategy implements IFindContractStrategy {
  constructor(
    @InjectModel(Contract)
    private contractModel: typeof Contract,
  ) {}
  async find(contractInfo: QueryContractDto): Promise<Contract[] | null> {
    if (Object.keys(contractInfo).length < 1)
      return await this.contractModel.findAll();
    return await this.contractModel.findAll({ where: contractInfo });
  }
}
