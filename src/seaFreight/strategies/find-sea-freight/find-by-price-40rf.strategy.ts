import { Injectable } from '@nestjs/common';
import { SeaFreight } from '@/seaFreight/models/seaFreight.model';
import { IFindSeaFreightStrategy } from './find-sea-freight-strategy.interface';

@Injectable()
export class FindSeaFreightByPrice40rfStrategy implements IFindSeaFreightStrategy {
  async find(seaFreight40rf: number): Promise<SeaFreight[] | null> {
    return SeaFreight.findAll({
      where: {price_40rf: seaFreight40rf},
    });
  }
}