import { Injectable } from '@nestjs/common';
import { LandFreight } from '@/landFreight/models/landFreight.model';
import { IFindLandFreightStrategy } from './find-land-freight-strategy.interface';

@Injectable()
export class FindLandFreightByPrice5000_10000Strategy implements IFindLandFreightStrategy {
  async find(price: number): Promise<LandFreight[] | null> {
    return LandFreight.findAll({
      where: { '5000_10000': price },
    });
  }
}
