import { Injectable } from '@nestjs/common';
import { AirFreight } from '@/airFreight/models/airFreight.model';
import { IFindAirFreightStrategy } from './find-air-freight-strategy.interface';

@Injectable()
export class FindAirFreightByPrice300kStrategy implements IFindAirFreightStrategy {
  async find(airFreight300k: number): Promise<AirFreight[] | null> {
    return AirFreight.findAll({
      where: {price_300k: airFreight300k},
    });
  }
}