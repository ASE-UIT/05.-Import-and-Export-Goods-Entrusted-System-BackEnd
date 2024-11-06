import { Injectable } from '@nestjs/common';
import { IFindProviderStrategy } from './find-providers-strategy.interface';
import { Provider } from '@/providers/models/providers.model';

@Injectable()
export class FindProviderByEmailStrategy implements IFindProviderStrategy {
  async find(providerEmail: string): Promise<Provider[] | null> {
    return Provider.findAll({ 
      where: { email: providerEmail }, 
    });
  }
}
