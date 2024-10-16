import { Injectable } from '@nestjs/common';
import { Freight } from '@/freight/models/freight.model';
import { IFindFreightStrategy } from './find-freight-strategy.interface';

@Injectable()
export class FindFreightByTransitStrategy implements IFindFreightStrategy {
  async find(freightTransit: string): Promise<Freight[] | null> {
    return Freight.findAll({
      where: {transit: freightTransit},
    });
  }
}