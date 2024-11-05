import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IUpdateLandFreightStrategy } from './update-land-freights-strategy.interface';
import { CreateLandFreightDto } from '@/land-freights/dtos/create-land-freights.dto';
import { LandFreight } from '@/land-freights/models/land-freights.model';
import { UniqueConstraintError, ForeignKeyConstraintError } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import {
  ValidationError,
  ValidationErrorDetail,
} from '@/shared/classes/validation-error.class';

@Injectable()
export class UpdateLandFreightStrategy implements IUpdateLandFreightStrategy {
  constructor(
    @InjectModel(LandFreight)
    private landFreightModel: typeof LandFreight,
  ) {}

  async update(
    landFreightId: string,
    updateInfo: Partial<CreateLandFreightDto>,
  ): Promise<LandFreight> {
    try {
      const [affectedRows, [updatedData]] = await this.landFreightModel.update(
        { ...updateInfo },
        { where: { land_freight_id: landFreightId }, returning: true },
      );

      if (affectedRows === 0) {
        throw new NotFoundException('Land freight not found');
      }

      return updatedData.dataValues as LandFreight;
    } catch (err) {
      if (err instanceof ForeignKeyConstraintError) {
        throw new NotFoundException('Freight not found');
      }
    }
  }
}
