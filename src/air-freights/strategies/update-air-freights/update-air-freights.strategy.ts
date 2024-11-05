import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IUpdateAirFreightStrategy } from './update-air-freights-strategy.interface'; 
import { CreateAirFreightDto } from '@/air-freights/dtos/create-air-freights.dto'; 
import { AirFreight } from '@/air-freights/models/air-freights.model';
import { ForeignKeyConstraintError, UniqueConstraintError } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import {
  ValidationError,
  ValidationErrorDetail,
} from '@/shared/classes/validation-error.class';

@Injectable()
export class UpdateAirFreightStrategy implements IUpdateAirFreightStrategy {
  constructor(
    @InjectModel(AirFreight)
    private airFreightModel: typeof AirFreight,
  ) {}

  async update(
    airFreightId: string,
    updateInfo: Partial<CreateAirFreightDto>,
  ): Promise<AirFreight> {
    try {
      const [affectedRows, [updatedData]] = await this.airFreightModel.update(
        { ...updateInfo },
        { where: { air_freight_id: airFreightId }, returning: true },
      );

      if (affectedRows === 0) {
        throw new NotFoundException('Air freight not found');
      }

      return updatedData.dataValues as AirFreight;
    } catch (err) {
      if (err instanceof TypeError) {
        throw new NotFoundException('Air freight not found');
      }
      if (err instanceof ForeignKeyConstraintError) {
        throw new NotFoundException('Contact representative not found');
      }
    }
  }
}
