import { Injectable } from '@nestjs/common';
import { Freight } from '@/freight/models/freight.model';
import { IFindFreightStrategy } from './find-freight-strategy.interface';

@Injectable()
export class FindFreightByProviderIdStrategy implements IFindFreightStrategy {
  async find(freightProviderId: string): Promise<Freight[] | null> {
    return Freight.findAll({
      where: {providerId: freightProviderId},
    });
  }
}