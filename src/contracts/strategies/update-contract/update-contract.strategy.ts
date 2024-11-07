import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IUpdateContractStrategy } from './update-contract-strategy.interface';
import { CreateContractDto } from '@/contracts/dtos/create-contract.dto';
import { Contract } from '@/contracts/models/contract.model';
import { InjectModel } from '@nestjs/sequelize';
import { NotFoundError } from 'rxjs';

@Injectable()
export class UpdateContractStrategy implements IUpdateContractStrategy {
  constructor(
    @InjectModel(Contract)
    private contractModel: typeof Contract,
  ) {}
  async update(
    contractId: string,
    udpateInfo: Partial<CreateContractDto>,
  ): Promise<Contract> {
    try {
      const [affetedRows, [updateData]] = await this.contractModel.update(
        { ...udpateInfo },
        { where: { id: contractId }, returning: true },
      );
      return updateData.dataValues as Contract;
    } catch (err) {
      if (err instanceof TypeError) {
        throw new NotFoundException('Contract not found');
      }
    }
  }
}
