import { BadRequestException, Injectable } from '@nestjs/common';
import { IUpdateSeaFreightStrategy } from './update-sea-freight-strategy.interface';
import { CreateSeaFreightDto } from '@/seaFreight/dtos/CreateSeaFreightDto';
import { SeaFreight } from '@/seaFreight/models/seaFreight.model';

@Injectable()
export class UpdateSeaFreightStrategy implements IUpdateSeaFreightStrategy {
  async update(
    seaFreightId: string,
    updateInfo: Partial<CreateSeaFreightDto>,
  ): Promise<SeaFreight> {
    const [affectedRows, [updatedData]] = await SeaFreight.update(
      { ...updateInfo },
      { where: { id: seaFreightId }, returning: true },
    );

    if (affectedRows === 0)
      throw new BadRequestException("Sea freight doesn't exist");
    return updatedData.dataValues as SeaFreight;
  }
}