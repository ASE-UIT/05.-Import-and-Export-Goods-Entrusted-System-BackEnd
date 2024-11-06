import { Injectable } from '@nestjs/common';
import { Freight } from '@/freights/models/freights.model';
import { IFindFreightStrategy } from './find-freights-strategy.interface';

@Injectable()
export class FindFreightByTypeStrategy implements IFindFreightStrategy {
  async find(freightType: string): Promise<Freight[] | null> {
    return Freight.findAll({
      where: {freight_type: freightType},
    });
  }
}