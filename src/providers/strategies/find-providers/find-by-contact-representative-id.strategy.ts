import { Injectable } from '@nestjs/common';
import { IFindProviderStrategy } from './find-providers-strategy.interface';
import { Provider } from '@/providers/models/providers.model';

@Injectable()
export class FindProviderByContactRepIdStrategy implements IFindProviderStrategy {
  async find(providerContactRepId: string): Promise<Provider[] | null> {
    return Provider.findAll({ 
      where: { contactRepId: providerContactRepId }, 
    });
  }
}