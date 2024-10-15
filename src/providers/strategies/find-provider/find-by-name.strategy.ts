import { Injectable } from '@nestjs/common';
import { IFindProviderStrategy } from './find-provider-strategy.interface';
import { Provider } from '@/providers/models/provider.model';

@Injectable()
export class FindProviderByNameStrategy implements IFindProviderStrategy {
  async find(providerName: string): Promise<Provider[] | null> {
    return Provider.findAll({ 
      where: { name: providerName},
    });
  }
}
