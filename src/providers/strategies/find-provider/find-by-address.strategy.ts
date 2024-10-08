import { Injectable } from '@nestjs/common';
import { Provider } from '@/providers/models/provider.model';
import { IFindProviderStrategy } from './find-provider-strategy.interface';

@Injectable()
export class FindProviderByAddressStrategy implements IFindProviderStrategy {
  async find(address: string): Promise<Provider[]> {
    return await Provider.findAll({ where: { address } });
  }
}