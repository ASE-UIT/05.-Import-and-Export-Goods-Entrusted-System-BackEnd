import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { IUpdateFreightStrategy } from './update-freight-strategy.interface';
import { CreateFreightDto } from '@/freight/dtos/CreateFreightDto';
import { Freight } from '@/freight/models/freight.model';
import { UpdateFreightDto } from '@/freight/dtos/UpdateFreightDto';
import { UniqueConstraintError } from 'sequelize';

@Injectable()
export class UpdateFreightStrategy implements IUpdateFreightStrategy {
  async update(
    freightId: string,
    updateInfo: UpdateFreightDto,
  ): Promise<Freight> {
    try {
      const [affectedRows, [updatedData]] = await Freight.update(
        { ...updateInfo },
        { where: { id: freightId }, returning: true },
      );
      return updatedData.dataValues as Freight;
    } catch (err) {
      if (err instanceof TypeError) {
        throw new NotFoundException('Freight not found');
      }
      if (err instanceof UniqueConstraintError) {
        throw new ConflictException(err.errors[0].message);
      }
      }
    }
}
