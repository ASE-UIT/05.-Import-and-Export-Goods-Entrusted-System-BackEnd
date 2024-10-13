import { Injectable } from '@nestjs/common';
import { AirFreight } from '@/airFreight/models/airFreight.model';
import { IFindAirFreightStrategy } from './find-air-freight-strategy.interface';

@Injectable()
export class FindAirFreightBySccStrategy implements IFindAirFreightStrategy {
  async find(airFreightScc: string): Promise<AirFreight[] | null> {
    return AirFreight.findAll({
      where: {scc: airFreightScc},
    });
  }
}