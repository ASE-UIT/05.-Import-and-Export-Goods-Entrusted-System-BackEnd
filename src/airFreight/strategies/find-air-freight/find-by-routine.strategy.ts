import { Injectable } from '@nestjs/common';
import { AirFreight } from '@/airFreight/models/airFreight.model';
import { IFindAirFreightStrategy } from './find-air-freight-strategy.interface';

@Injectable()
export class FindAirFreightByRoutineStrategy implements IFindAirFreightStrategy {
  async find(airFreightRoutine: string): Promise<AirFreight[] | null> {
    return AirFreight.findAll({
      where: {routine: airFreightRoutine},
    });
  }
}