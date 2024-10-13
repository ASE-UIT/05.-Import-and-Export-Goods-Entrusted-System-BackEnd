import { Injectable } from '@nestjs/common';
import { IFindProviderStrategy } from './find-provider-strategy.interface';
import { Provider } from '@/providers/models/provider.model';

@Injectable()
export class FindProviderByNameStrategy implements IFindProviderStrategy {
  async find(name: string): Promise<Provider[]> {
    return await Provider.findAll({ where: { name } });
  }
}
