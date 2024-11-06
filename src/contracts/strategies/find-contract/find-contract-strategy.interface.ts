import { Contract } from '@/contracts/models/contract.model';

export interface IFindContractStrategy {
  find(contractInfo: any): Promise<Contract[] | null>;
}
