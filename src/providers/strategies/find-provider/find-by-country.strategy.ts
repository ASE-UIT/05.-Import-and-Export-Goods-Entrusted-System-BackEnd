import { Injectable } from '@nestjs/common';
import { Provider } from '@/providers/models/provider.model';
import { IFindProviderStrategy } from './find-provider-strategy.interface';

@Injectable()
export class FindProviderByCountryStrategy implements IFindProviderStrategy {
  async find(country: string): Promise<Provider[]> {
    return await Provider.findAll({ where: { country } });
  }
}
