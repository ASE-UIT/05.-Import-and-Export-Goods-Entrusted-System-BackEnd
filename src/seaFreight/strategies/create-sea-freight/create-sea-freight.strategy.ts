import { ConflictException, Injectable } from '@nestjs/common';
import { ICreateSeaFreightStrategy } from './create-sea-freight-strategy.interface';
import { CreateSeaFreightDto } from '@/seaFreight/dtos/CreateSeaFreightDto';
import { SeaFreight } from '@/seaFreight/models/seaFreight.model';
import { UniqueConstraintError } from 'sequelize';

@Injectable()
export class CreateSeaFreightStrategy implements ICreateSeaFreightStrategy {
  async create(seaFreightData: CreateSeaFreightDto): Promise<SeaFreight> {
    const seaFreight = new SeaFreight();
    seaFreight["20DC"] = seaFreightData["20DC"];
    seaFreight["40DC"] = seaFreightData["40DC"];
    seaFreight["40HC"] = seaFreightData["40HC"];
    seaFreight["20RF"] = seaFreightData["20RF"];
    seaFreight["40RF"] = seaFreightData["40RF"];
    seaFreight.freight_id = seaFreightData.freight_id;

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
