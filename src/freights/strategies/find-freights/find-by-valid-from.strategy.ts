import { Injectable } from '@nestjs/common';
import { Freight } from '@/freights/models/freights.model';
import { IFindFreightStrategy } from './find-freights-strategy.interface';

@Injectable()
export class FindFreightByValidFromStrategy implements IFindFreightStrategy {
  async find(freightValidFrom: Date): Promise<Freight[] | null> {
    return Freight.findAll({
      where: {validFrom: freightValidFrom},
    });
  }
}