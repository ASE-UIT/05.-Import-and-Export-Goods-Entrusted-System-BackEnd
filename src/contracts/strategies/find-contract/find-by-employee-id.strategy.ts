import { Injectable } from '@nestjs/common';
import { IFindContractStrategy } from './find-contract-strategy.interface';
import { Contract } from '@/contracts/models/contract.model';

@Injectable()
export class FindContractByEmployeeIdStrategy implements IFindContractStrategy {
  async find(contractEmployeeId: string): Promise<Contract[] | null> {
    return Contract.findAll({
      where: { employeeId: contractEmployeeId },
    });
  }
}
