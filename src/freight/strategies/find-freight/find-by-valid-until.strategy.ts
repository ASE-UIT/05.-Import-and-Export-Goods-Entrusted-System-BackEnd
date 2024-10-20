import { Injectable } from '@nestjs/common';
import { Freight } from '@/freight/models/freight.model';
import { IFindFreightStrategy } from './find-freight-strategy.interface';

@Injectable()
export class FindFreightByValidUntilStrategy implements IFindFreightStrategy {
  async find(freightValidUntil: Date): Promise<Freight[] | null> {
    return Freight.findAll({
      where: {validUntil: freightValidUntil},
    });
  }
}