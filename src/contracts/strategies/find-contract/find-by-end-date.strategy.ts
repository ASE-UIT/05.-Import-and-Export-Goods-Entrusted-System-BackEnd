import { Injectable } from '@nestjs/common';
import { IFindContractStrategy } from './find-contract-strategy.interface';
import { Contract } from '@/contracts/models/contract.model';

@Injectable()
export class FindContractByEndDateStrategy implements IFindContractStrategy {
  async find(contractEndDate: Date): Promise<Contract[] | null> {
    return Contract.findAll({
      where: { endDate: contractEndDate },
    });
  }
}
