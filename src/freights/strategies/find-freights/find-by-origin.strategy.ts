import { Injectable } from '@nestjs/common';
import { Freight } from '@/freights/models/freights.model';
import { IFindFreightStrategy } from './find-freights-strategy.interface';

@Injectable()
export class FindFreightByOriginStrategy implements IFindFreightStrategy {
  async find(freightOrigin: string): Promise<Freight[] | null> {
    return Freight.findAll({
      where: {origin: freightOrigin},
    });
  }
}