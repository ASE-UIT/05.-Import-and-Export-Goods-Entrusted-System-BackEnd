import { Injectable } from '@nestjs/common';
import { AirFreight } from '@/airFreight/models/airFreight.model';
import { IFindAirFreightStrategy } from './find-air-freight-strategy.interface';

@Injectable()
export class FindAirFreightByFscStrategy implements IFindAirFreightStrategy {
  async find(airFreightFsc: number): Promise<AirFreight[] | null> {
    return AirFreight.findAll({
      where: {fsc: airFreightFsc},
    });
  }
}