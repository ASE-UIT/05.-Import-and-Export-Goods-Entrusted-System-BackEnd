import { Injectable } from '@nestjs/common';
import { LandFreight } from '@/land-freights/models/land-freights.model';
import { IFindLandFreightStrategy } from './find-land-freights-strategy.interface';

@Injectable()
export class FindLandFreightByIdStrategy implements IFindLandFreightStrategy {
  async find(landFreight_id: String): Promise<LandFreight[] | null> {
    return LandFreight.findAll({
      where: { id : landFreight_id },
    });
  }
}