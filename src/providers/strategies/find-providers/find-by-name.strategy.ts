import { Injectable } from '@nestjs/common';
import { IFindProviderStrategy } from './find-providers-strategy.interface';
import { Provider } from '@/providers/models/providers.model';

@Injectable()
export class FindProviderByNameStrategy implements IFindProviderStrategy {
  async find(providerName: string): Promise<Provider[] | null> {
    return Provider.findAll({ 
      where: { name: providerName},
    });
  }
}
