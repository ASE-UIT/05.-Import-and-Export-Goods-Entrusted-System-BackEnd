import { CreateLclDto } from '@/lcl/dtos/CreateLclDto';
import { LCL } from '@/lcl/models/lcl.model';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UniqueConstraintError } from 'sequelize';
import { IUpdateLclStrategy } from './update-lcl-strategy.interface';

@Injectable()
export class UpdateLclStrategy implements IUpdateLclStrategy {
  async update(
    lcl_id: string,
    updateInfo: Partial<CreateLclDto>,
  ): Promise<LCL> {
    try {
      const [affectedRows, [updatedData]] = await LCL.update(
        { ...updateInfo },
        { where: { lcl_id: lcl_id }, returning: true }, 
      );
      return updatedData.dataValues as LCL;
    } catch (err) {
      if (err instanceof TypeError) {
        throw new NotFoundException('LCL not found');
      }
      if (err instanceof UniqueConstraintError) {
        throw new ConflictException(err.errors[0].message);
      }
    }
  }
}
