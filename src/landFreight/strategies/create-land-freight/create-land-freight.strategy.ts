import { ConflictException, Injectable } from '@nestjs/common';
import { ICreateLandFreightStrategy } from './create-land-freight-strategy.interface';
import { CreateLandFreightDto } from '@/landFreight/dtos/CreateLandFreightDto';
import { LandFreight } from '@/landFreight/models/landFreight.model';
import { UniqueConstraintError } from 'sequelize';

@Injectable()
export class CreateLandFreightStrategy implements ICreateLandFreightStrategy {
  async create(landFreightData: CreateLandFreightDto): Promise<LandFreight> {
    const landFreight = new LandFreight();
    landFreight.weight = landFreightData.weight;
    landFreight["100_200"] = landFreightData["100_200"];
    landFreight["200_500"] = landFreightData["200_500"];
    landFreight["500_1500"] = landFreightData["500_1500"];
    landFreight["1500_5000"] = landFreightData["1500_5000"];
    landFreight["5000_10000"] = landFreightData["5000_10000"];
    landFreight["10000"] = landFreightData["10000"];
    landFreight.freight_id = landFreightData.freight_id;

    try {
      await landFreight.save();
      return landFreight;
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        throw new ConflictException(err.errors[0].message);
      }
    }
  }
}
