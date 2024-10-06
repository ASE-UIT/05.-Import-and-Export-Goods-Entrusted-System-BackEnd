import { Injectable } from '@nestjs/common';
import { IFindProviderStrategy } from './find-provider-strategy.interface';
import { Provider } from '@/providers/models/provider.model';

@Injectable()
export class FindProviderByEmailStrategy implements IFindProviderStrategy {
  async find(email: string): Promise<Provider[]> {
    return await Provider.findAll({ where: { email } });
  }
}
