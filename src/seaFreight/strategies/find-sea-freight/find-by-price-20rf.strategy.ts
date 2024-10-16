import { Injectable } from '@nestjs/common';
import { SeaFreight } from '@/seaFreight/models/seaFreight.model';
import { IFindSeaFreightStrategy } from './find-sea-freight-strategy.interface';

@Injectable()
export class FindSeaFreightByPrice20rfStrategy implements IFindSeaFreightStrategy {
  async find(seaFreight20rf: number): Promise<SeaFreight[] | null> {
    return SeaFreight.findAll({
      where: {price_20rf: seaFreight20rf},
    });
  }
}