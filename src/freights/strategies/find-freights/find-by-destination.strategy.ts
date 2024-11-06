import { Injectable } from '@nestjs/common';
import { Freight } from '@/freights/models/freights.model';
import { IFindFreightStrategy } from './find-freights-strategy.interface';

@Injectable()
export class FindFreightByDestinationStrategy implements IFindFreightStrategy {
  async find(freightDestination: string): Promise<Freight[] | null> {
    return Freight.findAll({
      where: {destination: freightDestination},
    });
  }
}