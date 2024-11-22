import { Injectable } from '@nestjs/common';
import { AirFreight } from '@/air-freights/models/air-freights.model';
import { IFindAirFreightStrategy } from './find-air-freights-strategy.interface';

@Injectable()
export class FindAirFreightByIdStrategy implements IFindAirFreightStrategy {
  async find(airFreightId: number): Promise<AirFreight[] | null> {
    return AirFreight.findAll({
      where: {id: airFreightId},
    });
  }
}