import { Injectable } from '@nestjs/common';
import { AirFreight } from '@/airFreight/models/airFreight.model';
import { IFindAirFreightStrategy } from './find-air-freight-strategy.interface';

@Injectable()
export class FindAirFreightByPrice45kStrategy implements IFindAirFreightStrategy {
  async find(airFreight45k: number): Promise<AirFreight[] | null> {
    return AirFreight.findAll({
      where: {price_45k: airFreight45k},
    });
  }
}