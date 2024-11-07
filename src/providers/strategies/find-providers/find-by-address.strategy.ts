import { Injectable } from '@nestjs/common';
import { IFindProviderStrategy } from './find-providers-strategy.interface';
import { Provider } from '@/providers/models/providers.model';

@Injectable()
export class FindProviderByAddressStrategy implements IFindProviderStrategy {
  async find(providerAddress: string): Promise<Provider[] | null> {
    return Provider.findAll({ 
      where: { address: providerAddress }, 
    });
  }
}