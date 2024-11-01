import { Injectable } from '@nestjs/common';
import { Freight } from '@/freight/models/freight.model';
import { IFindFreightStrategy } from './find-freight-strategy.interface';
import { ProviderStatus } from '@/providers/models/provider.model';

@Injectable()
export class FindFreightByStatusStrategy implements IFindFreightStrategy {
  async find(freightStatus: ProviderStatus): Promise<Freight[] | null> {
    return Freight.findAll({
      where: {providerStatus: freightStatus},
    });
  }
}