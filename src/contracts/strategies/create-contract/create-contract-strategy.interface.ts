import { CreateContractDto } from '@/contracts/dtos/CreateContractDto';
import { Contract } from '@/contracts/models/contract.model';

export interface ICreateContractStrategy {
  create(strategyInfo: CreateContractDto): Promise<Contract>;
}
