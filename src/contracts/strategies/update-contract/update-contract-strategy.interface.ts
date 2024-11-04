import { CreateContractDto } from '@/contracts/dtos/create-contract.dto';
import { Contract } from '@/contracts/models/contract.model';

export interface IUpdateContractStrategy {
  update(
    contractId: string,
    udpateInfo: Partial<CreateContractDto>,
  ): Promise<Contract>;
}
