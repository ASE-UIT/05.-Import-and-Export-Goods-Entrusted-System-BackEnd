import { Injectable } from '@nestjs/common';
import { LandFreight } from '@/landFreight/models/landFreight.model';
import { IFindLandFreightStrategy } from './find-land-freight-strategy.interface';

@Injectable()
export class FindLandFreightByPrice200_500Strategy implements IFindLandFreightStrategy {
  async find(price: number): Promise<LandFreight[] | null> {
    return LandFreight.findAll({
      where: { '200_500': price },
    });
  }
}
