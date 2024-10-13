import { Injectable } from '@nestjs/common';
import { AirFreight } from '@/airFreight/models/airFreight.model';
import { IFindAirFreightStrategy } from './find-air-freight-strategy.interface';

@Injectable()
export class FindAirFreightByFreightIdStrategy implements IFindAirFreightStrategy {
  async find(airFreightId: string): Promise<AirFreight[] | null> {
    return AirFreight.findAll({
      where: {freight_id: airFreightId},
    });
  }
}