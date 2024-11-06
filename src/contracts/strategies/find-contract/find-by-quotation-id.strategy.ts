import { Injectable } from '@nestjs/common';
import { IFindContractStrategy } from './find-contract-strategy.interface';
import { Contract } from '@/contracts/models/contract.model';

@Injectable()
export class FindContractByQuotationIdStrategy
  implements IFindContractStrategy
{
  async find(contractQuotationId: string): Promise<Contract[] | null> {
    return Contract.findAll({
      where: { quotationId: contractQuotationId },
    });
  }
}
