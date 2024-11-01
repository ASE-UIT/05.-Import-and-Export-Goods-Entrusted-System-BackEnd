import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { IUpdateLandFreightStrategy } from './update-land-freight-strategy.interface'; 
import { CreateLandFreightDto } from '@/landFreight/dtos/CreateLandFreightDto'; 
import { LandFreight } from '@/landFreight/models/landFreight.model';
import { UniqueConstraintError } from 'sequelize';

@Injectable()
export class UpdateLandFreightStrategy implements IUpdateLandFreightStrategy {
  async update(
    landFreightId: string,
    updateInfo: Partial<CreateLandFreightDto>,
  ): Promise<LandFreight> {
    try {
      const [affectedRows, [updatedData]] = await LandFreight.update(
        { ...updateInfo },
        { where: { land_freight_id: landFreightId }, returning: true }, 
      );
      return updatedData.dataValues as LandFreight;
    } catch (err) {
      if (err instanceof TypeError) {
        throw new NotFoundException('Land freight not found');
      }
      if (err instanceof UniqueConstraintError) {
        throw new ConflictException(err.errors[0].message);
      }
    }
  }
}
