import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IUpdateFclStrategy } from './update-fcls-strategy.interface';
import { FCL } from '@/fcls/models/fcls.model';
import { ForeignKeyConstraintError, UniqueConstraintError } from 'sequelize';
import { CreateFclDto, UpdateFclDto } from '@/fcls/dtos/create-fcls.dto'; // Đảm bảo có UpdateFclDto
import { InjectModel } from '@nestjs/sequelize';
import {
  ValidationError,
  ValidationErrorDetail,
} from '@/shared/classes/validation-error.class';

@Injectable()
export class UpdateFclStrategy implements IUpdateFclStrategy {
  constructor(
    @InjectModel(FCL)
    private fclModel: typeof FCL,
  ) {}

  async update(
    fclId: string,
    updateInfo: Partial<CreateFclDto>,
  ): Promise<FCL> {
    const fcl = await this.fclModel.findByPk(fclId);
    if (!fcl) {
      throw new NotFoundException('FCL not found');
    }
    try {
      const [affectedRows, [updateData]] = await this.fclModel.update(
        { ...updateInfo },
        { where: { fcl_id: fclId }, returning: true },
      );
      if (affectedRows === 0) {
        throw new NotFoundException('FCL not found');
      }
      return updateData.dataValues as FCL;
    } catch (err) {
      if (err instanceof TypeError) {
        throw new NotFoundException('FCL not found');
      }
      if (err instanceof ForeignKeyConstraintError) {
        throw new NotFoundException('Freight not found');
      }
    }
  }
}
