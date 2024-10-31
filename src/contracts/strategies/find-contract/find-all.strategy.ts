import { Contract } from '@/contracts/models/contract.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindAllContractStrategy implements FindAllContractStrategy {
  async find(): Promise<Contract[] | null> {
    return Contract.findAll();
  }
}
