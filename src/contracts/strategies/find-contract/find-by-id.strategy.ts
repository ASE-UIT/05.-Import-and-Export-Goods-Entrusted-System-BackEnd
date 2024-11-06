import { Injectable } from '@nestjs/common';
import { IFindContractStrategy } from './find-contract-strategy.interface';
import { Contract } from '@/contracts/models/contract.model';

@Injectable()
export class FindContractByIdStrategy implements IFindContractStrategy {
  async find(contractId: string): Promise<Contract[] | null> {
    return Contract.findAll({
      where: { id: contractId },
    });
  }
}
