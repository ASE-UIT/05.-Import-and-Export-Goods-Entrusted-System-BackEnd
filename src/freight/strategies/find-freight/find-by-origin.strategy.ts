import { Injectable } from '@nestjs/common';
import { Freight } from '@/freight/models/freight.model';
import { IFindFreightStrategy } from './find-freight-strategy.interface';

@Injectable()
export class FindFreightByOriginStrategy implements IFindFreightStrategy {
  async find(freightOrigin: string): Promise<Freight[] | null> {
    return Freight.findAll({
      where: {origin: freightOrigin},
    });
  }
}