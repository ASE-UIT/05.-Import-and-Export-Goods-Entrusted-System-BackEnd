import { Injectable } from '@nestjs/common';
import { LandFreight } from '@/landFreight/models/landFreight.model';
import { IFindLandFreightStrategy } from './find-land-freight-strategy.interface';

@Injectable()
export class FindLandFreightByWeightStrategy implements IFindLandFreightStrategy {
  async find(weight: number): Promise<LandFreight[] | null> {
    return LandFreight.findAll({
      where: { weight },
    });
  }
}
