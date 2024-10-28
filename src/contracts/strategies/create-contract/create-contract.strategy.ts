import { CreateContractDto } from '@/contracts/dtos/CreateContractDto';
import { Contract } from '@/contracts/models/contract.model';
import { ICreateContractStrategy } from './create-contract-strategy.interface';

export class CreateContractStrategy implements ICreateContractStrategy {
  async create(strategyInfo: CreateContractDto): Promise<Contract> {
    const contract = new Contract();
    contract.startDate = strategyInfo.startDate;
    contract.endDate = strategyInfo.endDate;
    contract.status = strategyInfo.status;
    contract.contractDate = strategyInfo.contractDate;
    contract.employeeId = strategyInfo.employeeId;
    contract.quotationId = strategyInfo.quotationId;
    await contract.save();
    return contract;
  }
}
