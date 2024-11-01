import { Injectable } from '@nestjs/common';
import { AirFreight } from '@/airFreight/models/airFreight.model';
import { IFindAirFreightStrategy } from './find-air-freight-strategy.interface';

@Injectable()
export class FindAirFreightByPrice0kStrategy implements IFindAirFreightStrategy {
  async find(airFreight0k: number): Promise<AirFreight[] | null> {
    return AirFreight.findAll({
      where: {price_0k: airFreight0k},
    });
  }
}