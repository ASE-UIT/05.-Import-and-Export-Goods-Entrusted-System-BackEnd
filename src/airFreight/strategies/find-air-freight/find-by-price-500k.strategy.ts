import { Injectable } from '@nestjs/common';
import { AirFreight } from '@/airFreight/models/airFreight.model';
import { IFindAirFreightStrategy } from './find-air-freight-strategy.interface';

@Injectable()
export class FindAirFreightByPrice500kStrategy implements IFindAirFreightStrategy {
  async find(airFreight500k: number): Promise<AirFreight[] | null> {
    return AirFreight.findAll({
      where: {price_500k: airFreight500k},
    });
  }
}
