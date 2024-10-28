import { CreateContractDto } from '@/contracts/dtos/CreateContractDto';
import { Contract } from '@/contracts/models/contract.model';

export interface IUpdateContractStrategy {
  update(
    contractId: string,
    udpateInfo: Partial<CreateContractDto>,
  ): Promise<Contract>;
}
