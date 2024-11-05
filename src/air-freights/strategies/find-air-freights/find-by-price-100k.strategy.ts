import { Injectable } from '@nestjs/common';
import { AirFreight } from '@/air-freights/models/air-freights.model';
import { IFindAirFreightStrategy } from './find-air-freights-strategy.interface';

@Injectable()
export class FindAirFreightByPrice100kStrategy implements IFindAirFreightStrategy {
  async find(airFreight100k: number): Promise<AirFreight[] | null> {
    return AirFreight.findAll({
      where: {price_100k: airFreight100k},
    });
  }
}