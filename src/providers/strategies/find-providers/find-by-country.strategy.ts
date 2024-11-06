import { Injectable } from '@nestjs/common';
import { IFindProviderStrategy } from './find-providers-strategy.interface';
import { Provider } from '@/providers/models/providers.model';

@Injectable()
export class FindProviderByCountryStrategy implements IFindProviderStrategy {
  async find(providerCountry: string): Promise<Provider[] | null> {
    return Provider.findAll({ 
      where: { country: providerCountry }, 
    });
  }
}