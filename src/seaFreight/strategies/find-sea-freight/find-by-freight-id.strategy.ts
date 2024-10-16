import { Injectable } from '@nestjs/common';
import { SeaFreight } from '@/seaFreight/models/seaFreight.model';
import { IFindSeaFreightStrategy } from './find-sea-freight-strategy.interface';

@Injectable()
export class FindSeaFreightByFreightIdStrategy implements IFindSeaFreightStrategy {
  async find(seaFreightId: string): Promise<SeaFreight[] | null> {
    return SeaFreight.findAll({
      where: {freight_id: seaFreightId},
    });
  }
}