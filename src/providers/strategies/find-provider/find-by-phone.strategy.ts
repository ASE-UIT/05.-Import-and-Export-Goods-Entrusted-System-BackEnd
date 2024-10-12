import { Injectable } from '@nestjs/common';
import { IFindProviderStrategy } from './find-provider-strategy.interface';
import { Provider } from '@/providers/models/provider.model';

@Injectable()
export class FindProviderByPhoneStrategy implements IFindProviderStrategy {
  async find(phone: string): Promise<Provider[]> {
    return await Provider.findAll({ where: { phone } });
  }
}
