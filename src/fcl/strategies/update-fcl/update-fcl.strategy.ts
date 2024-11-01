import { CreateFclDto } from '@/fcl/dtos/CreateFclDto';
import { FCL } from '@/fcl/models/fcl.model';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UniqueConstraintError } from 'sequelize';
import { IUpdateFclStrategy } from './update-fcl-strategy.interface';

@Injectable()
export class UpdateFclStrategy implements IUpdateFclStrategy {
  async update(
    fcl_Id: string,
    updateInfo: Partial<CreateFclDto>,
  ): Promise<FCL> {
    try {
      const [affectedRows, [updatedData]] = await FCL.update(
        { ...updateInfo },
        { where: { fcl_id: fcl_Id }, returning: true }, 
      );
      return updatedData.dataValues as FCL;
    } catch (err) {
      if (err instanceof TypeError) {
        throw new NotFoundException('FCL not found');
      }
      if (err instanceof UniqueConstraintError) {
        throw new ConflictException(err.errors[0].message);
      }
    }
  }
}