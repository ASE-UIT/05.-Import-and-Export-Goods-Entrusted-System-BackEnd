import { Injectable } from '@nestjs/common';
import { LandFreight } from '@/landFreight/models/landFreight.model';
import { IFindLandFreightStrategy } from './find-land-freight-strategy.interface';

@Injectable()
export class FindLandFreightByFreightIdStrategy implements IFindLandFreightStrategy {
  async find(freight_id: String): Promise<LandFreight[] | null> {
    return LandFreight.findAll({
      where: { freightId : freight_id },
    });
  }
}
