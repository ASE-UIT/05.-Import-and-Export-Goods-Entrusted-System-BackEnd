import { CreateContractDto } from '@/contracts/dtos/create-contract.dto';
import { Contract } from '@/contracts/models/contract.model';

export interface ICreateContractStrategy {
  create(strategyInfo: CreateContractDto): Promise<Contract>;
}
