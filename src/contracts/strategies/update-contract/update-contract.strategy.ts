import { BadRequestException, Injectable } from '@nestjs/common';
import { IUpdateContractStrategy } from './update-contract-strategy.interface';
import { CreateContractDto } from '@/contracts/dtos/CreateContractDto';
import { Contract } from '@/contracts/models/contract.model';

@Injectable()
export class UpdateContractStrategy implements IUpdateContractStrategy {
  async update(
    contractId: string,
    udpateInfo: Partial<CreateContractDto>,
  ): Promise<Contract> {
    const [affetedRows, [updateData]] = await Contract.update(
      { ...udpateInfo },
      { where: { id: contractId }, returning: true },
    );
    if (affetedRows === 0) {
      throw new BadRequestException("Contract doesn't exist");
    }
    return updateData.dataValues as Contract;
  }
}
