import { Injectable } from '@nestjs/common';
import { IFindProviderStrategy } from './find-provider-strategy.interface';
import { Provider } from '@/providers/models/provider.model';

@Injectable()
export class FindProviderByAddressStrategy implements IFindProviderStrategy {
  async find(providerAddress: string): Promise<Provider[] | null> {
    return Provider.findAll({ 
      where: { address: providerAddress }, 
    });
  }
}