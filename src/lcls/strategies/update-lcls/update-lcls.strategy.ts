import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IUpdateLclStrategy } from './update-lcls-strategy.interface';
import { CreateLclDto } from '@/lcls/dtos/create-lcls.dto';
import { LCL } from '@/lcls/models/lcls.model';
import { UniqueConstraintError, ForeignKeyConstraintError } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import {
  ValidationError,
  ValidationErrorDetail,
} from '@/shared/classes/validation-error.class';

@Injectable()
export class UpdateLclStrategy implements IUpdateLclStrategy {
  constructor(
    @InjectModel(LCL)
    private lclModel: typeof LCL,
  ) {}

  async update(
    lclId: string,
    updateInfo: Partial<CreateLclDto>,
  ): Promise<LCL> {
    try {
      const [affectedRows, [updatedData]] = await this.lclModel.update(
        { ...updateInfo },
        { where: { lcl_id: lclId }, returning: true },
      );

      if (affectedRows === 0) {
        throw new NotFoundException('LCL not found');
      }

      return updatedData.dataValues as LCL;
    } catch (err) {
      if (err instanceof ForeignKeyConstraintError) {
        throw new NotFoundException('Freight not found');
      }
    }
  }
}
