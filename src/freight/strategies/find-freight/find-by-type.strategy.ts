import { Injectable } from '@nestjs/common';
import { Freight } from '@/freight/models/freight.model';
import { IFindFreightStrategy } from './find-freight-strategy.interface';

@Injectable()
export class FindFreightByTypeStrategy implements IFindFreightStrategy {
  async find(freightType: string): Promise<Freight[] | null> {
    return Freight.findAll({
      where: {freight_type: freightType},
    });
  }
}