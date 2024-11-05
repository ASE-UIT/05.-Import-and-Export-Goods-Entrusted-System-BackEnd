import { Injectable } from '@nestjs/common';
import { Freight } from '@/freights/models/freights.model';
import { IFindFreightStrategy } from './find-freights-strategy.interface';

@Injectable()
export class FindFreightByProviderIdStrategy implements IFindFreightStrategy {
  async find(freightProviderId: string): Promise<Freight[] | null> {
    return Freight.findAll({
      where: {providerId: freightProviderId},
    });
  }
}