import { Injectable } from '@nestjs/common';
import { SeaFreight } from '@/seaFreight/models/seaFreight.model';
import { IFindSeaFreightStrategy } from './find-sea-freight-strategy.interface';

@Injectable()
export class FindSeaFreightByPrice40hcStrategy implements IFindSeaFreightStrategy {
  async find(seaFreight40hc: number): Promise<SeaFreight[] | null> {
    return SeaFreight.findAll({
      where: {price_40hc: seaFreight40hc},
    });
  }
}