import { BadRequestException, Injectable } from '@nestjs/common';
import { IUpdateFreightStrategy } from './update-freight-strategy.interface';
import { CreateFreightDto } from '@/freight/dtos/CreateFreightDto';
import { Freight } from '@/freight/models/freight.model';
import { UpdateFreightDto } from '@/freight/dtos/UpdateFreightDto';

@Injectable()
export class UpdateFreightStrategy implements IUpdateFreightStrategy {
  async update(
    freightId: string,
    updateInfo: UpdateFreightDto,
  ): Promise<Freight> {
    const [affectedRows, [updatedData]] = await Freight.update(
      { ...updateInfo },
      { where: { id: freightId }, returning: true },
    );

    if (affectedRows === 0)
      throw new BadRequestException("Freight doesn't exist");
    return updatedData.dataValues as Freight;
  }
}
