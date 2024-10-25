import { ConflictException, Injectable } from '@nestjs/common';
import { ICreateSeaFreightStrategy } from './create-sea-freight-strategy.interface';
import { CreateSeaFreightDto } from '@/seaFreight/dtos/CreateSeaFreightDto';
import { SeaFreight } from '@/seaFreight/models/seaFreight.model';
import { UniqueConstraintError } from 'sequelize';

@Injectable()
export class CreateSeaFreightStrategy implements ICreateSeaFreightStrategy {
  async create(seaFreightData: CreateSeaFreightDto): Promise<SeaFreight> {
    const seaFreight = new SeaFreight()
    seaFreight.price_20dc = seaFreightData.price_20dc;
    seaFreight.price_20rf = seaFreightData.price_20rf;
    seaFreight.price_40dc = seaFreightData.price_40dc;
    seaFreight.price_40hc = seaFreightData.price_40hc;
    seaFreight.price_40rf = seaFreightData.price_40rf;
    seaFreight.freight_id = seaFreightData.freight_id
    try {
      await seaFreight.save();
      return seaFreight;
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        throw new ConflictException(err.errors[0].message);
      }
    }
  }
}
