import { Injectable } from '@nestjs/common';
import { Freight } from '@/freight/models/freight.model';
import { IFindFreightStrategy } from './find-freight-strategy.interface';

@Injectable()
export class FindFreightByDestinationStrategy implements IFindFreightStrategy {
  async find(freightDestination: string): Promise<Freight[] | null> {
    return Freight.findAll({
      where: {destination: freightDestination},
    });
  }
}