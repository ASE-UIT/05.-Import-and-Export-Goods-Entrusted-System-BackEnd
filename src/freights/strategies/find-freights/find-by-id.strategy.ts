import { Injectable } from '@nestjs/common';
import { Freight } from '@/freights/models/freights.model';
import { IFindFreightStrategy } from './find-freights-strategy.interface';

@Injectable()
export class FindFreightByIdStrategy implements IFindFreightStrategy {
  async find(freightId: string): Promise<Freight[] | null> {
    return Freight.findAll({
      where: {id: freightId},
    });
  }
}