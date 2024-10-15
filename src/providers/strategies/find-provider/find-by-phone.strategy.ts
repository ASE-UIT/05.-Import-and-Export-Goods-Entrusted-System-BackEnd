import { Injectable } from '@nestjs/common';
import { IFindProviderStrategy } from './find-provider-strategy.interface';
import { Provider } from '@/providers/models/provider.model';

@Injectable()
export class FindProviderByPhoneStrategy implements IFindProviderStrategy {
  async find(providerPhone: string): Promise<Provider[] | null> {
    return Provider.findAll({ 
      where: { phone: providerPhone },
    });
  }
}
