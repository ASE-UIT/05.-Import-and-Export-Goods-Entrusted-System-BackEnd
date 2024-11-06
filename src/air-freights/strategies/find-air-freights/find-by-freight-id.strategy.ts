import { Injectable } from '@nestjs/common';
import { AirFreight } from '@/air-freights/models/air-freights.model';
import { IFindAirFreightStrategy } from './find-air-freights-strategy.interface';

@Injectable()
export class FindAirFreightByFreightIdStrategy implements IFindAirFreightStrategy {
  async find(airFreightFreightId: number): Promise<AirFreight[] | null> {
    return AirFreight.findAll({
      where: {freight_id: airFreightFreightId},
    });
  }
}