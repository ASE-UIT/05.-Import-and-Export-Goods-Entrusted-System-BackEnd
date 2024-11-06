import { Injectable } from '@nestjs/common';
import { LandFreight } from '@/land-freights/models/land-freights.model';
import { IFindLandFreightStrategy } from './find-land-freights-strategy.interface';

@Injectable()
export class FindLandFreightByPrice0_100Strategy implements IFindLandFreightStrategy {
  async find(price: number): Promise<LandFreight[] | null> {
    return LandFreight.findAll({
      where: { price_0_100 : price },
    });
  }
}
