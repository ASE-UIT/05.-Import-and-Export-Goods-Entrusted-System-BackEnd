import { Injectable } from '@nestjs/common';
import { Freight } from '@/freight/models/freight.model';
import { IFindFreightStrategy } from './find-freight-strategy.interface';

@Injectable()
export class FindFreightByTransitTimeStrategy implements IFindFreightStrategy {
  async find(freightTransitTime: number): Promise<Freight[] | null> {
    return Freight.findAll({
      where: {transitTime: freightTransitTime},
    });
  }
}