import { Injectable } from '@nestjs/common';
import { IFindProviderStrategy } from './find-providers-strategy.interface';
import { Provider, ProviderStatus } from '@/providers/models/providers.model';

@Injectable()
export class FindProviderByStatusStrategy implements IFindProviderStrategy {
  async find(providerStatus: ProviderStatus): Promise<Provider[] | null> {
    return Provider.findAll({ 
      where: { status: providerStatus }, 
    });
  }
}