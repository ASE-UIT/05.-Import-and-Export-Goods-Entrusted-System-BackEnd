import { ConflictException, Injectable } from '@nestjs/common';
import { ICreateAirFreightStrategy } from './create-air-freight-strategy.interface';
import { CreateAirFreightDto } from '@/airFreight/dtos/CreateAirFreightDto';
import { AirFreight } from '@/airFreight/models/airFreight.model';
import { UniqueConstraintError } from 'sequelize';

@Injectable()
export class CreateAirFreightStrategy implements ICreateAirFreightStrategy {
  async create(airFreightData: CreateAirFreightDto): Promise<AirFreight> {
    const airFreight = new AirFreight();
    airFreight.price_0K = airFreightData.price_0K;
    airFreight.price_45K = airFreightData.price_45K;
    airFreight.price_100K = airFreightData.price_100K;
    airFreight.price_300K = airFreightData.price_300K;
    airFreight.price_500K = airFreightData.price_500K;
    airFreight.freight_id = airFreightData.freight_id;
    try {
      await airFreight.save();
      return airFreight;
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        throw new ConflictException(err.errors[0].message);
      }
    }
  }
}
