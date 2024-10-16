import { BadRequestException, Injectable } from '@nestjs/common';
import { IUpdateAirFreightStrategy } from './update-air-freight-strategy.interface'; 
import { CreateAirFreightDto } from '@/airFreight/dtos/CreateAirFreightDto'; 
import { AirFreight } from '@/airFreight/models/airFreight.model';

@Injectable()
export class UpdateAirFreightStrategy implements IUpdateAirFreightStrategy {
  async update(
    airFreightId: string,
    updateInfo: Partial<CreateAirFreightDto>,
  ): Promise<AirFreight> {
    const [affectedRows, [updatedData]] = await AirFreight.update(
      { ...updateInfo },
      { where: { air_freight_id: airFreightId }, returning: true }, 
    );

    if (affectedRows === 0) {
      throw new BadRequestException("Air freight doesn't exist");
    }
    return updatedData.dataValues as AirFreight; 
  }
}
