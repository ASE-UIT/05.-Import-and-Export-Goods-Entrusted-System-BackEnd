import { Injectable } from '@nestjs/common';
import { AirFreight } from '@/airFreight/models/airFreight.model';
import { IFindAirFreightStrategy } from './find-air-freight-strategy.interface';

@Injectable()
export class FindAirFreightByAmsFeesStrategy implements IFindAirFreightStrategy {
  async find(airFreightAmsFees: number): Promise<AirFreight[] | null> {
    return AirFreight.findAll({
      where: {ams_fees: airFreightAmsFees},
    });
  }
}