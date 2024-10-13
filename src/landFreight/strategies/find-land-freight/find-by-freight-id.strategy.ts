import { Injectable } from '@nestjs/common';
import { LandFreight } from '@/landFreight/models/landFreight.model';
import { IFindLandFreightStrategy } from './find-land-freight-strategy.interface';

@Injectable()
export class FindLandFreightByFreightIdStrategy implements IFindLandFreightStrategy {
  async find(landFreightId: string): Promise<LandFreight[] | null> {
    return LandFreight.findAll({
      where: { freight_id: landFreightId },
    });
  }
}
