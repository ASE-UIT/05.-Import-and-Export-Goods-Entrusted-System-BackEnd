import { Injectable } from '@nestjs/common';
import { IFindProviderStrategy } from './find-providers-strategy.interface';
import { Provider } from '@/providers/models/providers.model';

@Injectable()
export class FindProviderByPhoneStrategy implements IFindProviderStrategy {
  async find(providerPhone: string): Promise<Provider[] | null> {
    return Provider.findAll({ 
      where: { phone: providerPhone },
    });
  }
}
