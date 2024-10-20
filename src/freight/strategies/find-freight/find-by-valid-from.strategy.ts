import { Injectable } from '@nestjs/common';
import { Freight } from '@/freight/models/freight.model';
import { IFindFreightStrategy } from './find-freight-strategy.interface';

@Injectable()
export class FindFreightByValidFromStrategy implements IFindFreightStrategy {
  async find(freightValidFrom: Date): Promise<Freight[] | null> {
    return Freight.findAll({
      where: {validFrom: freightValidFrom},
    });
  }
}