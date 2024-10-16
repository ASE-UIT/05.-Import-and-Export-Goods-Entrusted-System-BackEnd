import { BadRequestException, Injectable } from '@nestjs/common';
import { IUpdateLandFreightStrategy } from './update-land-freight-strategy.interface'; 
import { CreateLandFreightDto } from '@/landFreight/dtos/CreateLandFreightDto'; 
import { LandFreight } from '@/landFreight/models/landFreight.model';

@Injectable()
export class UpdateLandFreightStrategy implements IUpdateLandFreightStrategy {
  async update(
    landFreightId: string,
    updateInfo: Partial<CreateLandFreightDto>,
  ): Promise<LandFreight> {
    const [affectedRows, [updatedData]] = await LandFreight.update(
      { ...updateInfo },
      { where: { land_freight_id: landFreightId }, returning: true }, 
    );

    if (affectedRows === 0) {
      throw new BadRequestException("Land freight doesn't exist");
    }
    return updatedData.dataValues as LandFreight; 
  }
}
