import { Injectable } from '@nestjs/common';
import { Freight } from '@/freights/models/freights.model';
import { IFindFreightStrategy } from './find-freights-strategy.interface';

@Injectable()
export class FindFreightByValidUntilStrategy implements IFindFreightStrategy {
  async find(freightValidUntil: Date): Promise<Freight[] | null> {
    return Freight.findAll({
      where: {validUntil: freightValidUntil},
    });
  }
}