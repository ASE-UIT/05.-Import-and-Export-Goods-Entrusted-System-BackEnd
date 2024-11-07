import { Injectable } from '@nestjs/common';
import { IFindContractStrategy } from './find-contract-strategy.interface';
import { Contract } from '@/contracts/models/contract.model';

@Injectable()
export class FindContractByStartDateStrategy implements IFindContractStrategy {
  async find(contractStartDate: Date): Promise<Contract[] | null> {
    return Contract.findAll({
      where: { startDate: contractStartDate },
    });
  }
}
