import { Injectable } from '@nestjs/common';
import { Provider } from '@/providers/models/provider.model';
import { IFindProviderStrategy } from './find-provider-strategy.interface';

@Injectable()
export class FindProviderByAddressStrategy implements IFindProviderStrategy {
  async find(providerAddress: string): Promise<Provider[] | null> {
    return Provider.findAll({
      where: {address: providerAddress},
    });
  }
}