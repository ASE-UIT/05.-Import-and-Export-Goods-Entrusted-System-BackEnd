import { Injectable } from '@nestjs/common';
import { Freight } from '@/freights/models/freights.model';
import { IFindFreightStrategy } from './find-freights-strategy.interface';

@Injectable()
export class FindFreightByTransitTimeStrategy implements IFindFreightStrategy {
  async find(freightTransitTime: number): Promise<Freight[] | null> {
    return Freight.findAll({
      where: {transitTime: freightTransitTime},
    });
  }
}