import { Injectable } from '@nestjs/common';
import { Freight } from '@/freights/models/freights.model';
import { IFindFreightStrategy } from './find-freights-strategy.interface';
import { ProviderStatus } from '@/providers/models/providers.model';

@Injectable()
export class FindFreightByStatusStrategy implements IFindFreightStrategy {
  async find(freightStatus: ProviderStatus): Promise<Freight[] | null> {
    return Freight.findAll({
      where: {providerStatus: freightStatus},
    });
  }
}