import { Injectable } from '@nestjs/common';
import { IFindContractStrategy } from './find-contract-strategy.interface';
import { Contract } from '@/contracts/models/contract.model';

@Injectable()
export class FindContractByContractDateStrategy
  implements IFindContractStrategy
{
  async find(contractContractDate: Date): Promise<Contract[] | null> {
    return Contract.findAll({
      where: { contractDate: contractContractDate },
    });
  }
}
