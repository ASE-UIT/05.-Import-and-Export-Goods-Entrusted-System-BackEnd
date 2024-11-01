import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { IUpdateAirFreightStrategy } from './update-air-freight-strategy.interface'; 
import { CreateAirFreightDto } from '@/airFreight/dtos/CreateAirFreightDto'; 
import { AirFreight } from '@/airFreight/models/airFreight.model';
import { UniqueConstraintError } from 'sequelize';

@Injectable()
export class UpdateAirFreightStrategy implements IUpdateAirFreightStrategy {
  async update(
    airFreightId: string,
    updateInfo: Partial<CreateAirFreightDto>,
  ): Promise<AirFreight> {
    try {
      const [affectedRows, [updatedData]] = await AirFreight.update(
        { ...updateInfo },
        { where: { air_freight_id: airFreightId }, returning: true }, 
      );
      return updatedData.dataValues as AirFreight;
    } catch (err) {
      if (err instanceof TypeError) {
        throw new NotFoundException('Air freight not found');
      }
      if (err instanceof UniqueConstraintError) {
        throw new ConflictException(err.errors[0].message);
      }
    }
  }
}
