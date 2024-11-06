import { Contract } from '@/contracts/models/contract.model';
import { Injectable } from '@nestjs/common';
import { IFindContractStrategy } from './find-contract-strategy.interface';
import { ContractStatus } from '@/shared/enums/contract-status.enum';

@Injectable()
export class FindContractByStatusStrategy implements IFindContractStrategy {
  async find(contractStatus: ContractStatus): Promise<Contract[] | null> {
    return Contract.findAll({
      where: { status: contractStatus },
    });
  }
}
