import { Injectable } from '@nestjs/common';
import { SeaFreight } from '@/seaFreight/models/seaFreight.model';
import { IFindSeaFreightStrategy } from './find-sea-freight-strategy.interface';

@Injectable()
export class FindSeaFreightByPrice40dcStrategy implements IFindSeaFreightStrategy {
  async find(seaFreight40dc: number): Promise<SeaFreight[] | null> {
    return SeaFreight.findAll({
      where: {price_40dc: seaFreight40dc},
    });
  }
}