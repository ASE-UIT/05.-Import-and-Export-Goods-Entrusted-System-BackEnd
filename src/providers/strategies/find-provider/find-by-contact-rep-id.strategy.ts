import { Injectable } from '@nestjs/common';
import { IFindProviderStrategy } from './find-provider-strategy.interface';
import { Provider } from '@/providers/models/provider.model';

@Injectable()
export class FindProviderByContactRepIdStrategy implements IFindProviderStrategy {
  async find(providerContactRepId: string): Promise<Provider[] | null> {
    return Provider.findAll({ 
      where: { contactRepId: providerContactRepId }, 
    });
  }
}