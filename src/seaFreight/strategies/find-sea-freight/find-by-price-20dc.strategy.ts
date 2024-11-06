import { Injectable } from '@nestjs/common';
import { SeaFreight } from '@/seaFreight/models/seaFreight.model';
import { IFindSeaFreightStrategy } from './find-sea-freight-strategy.interface';

@Injectable()
export class FindSeaFreightByPrice20dcStrategy implements IFindSeaFreightStrategy {
  async find(seaFreight20dc: number): Promise<SeaFreight[] | null> {
    return SeaFreight.findAll({
      where: {price_20dc: seaFreight20dc},
    });
  }
}