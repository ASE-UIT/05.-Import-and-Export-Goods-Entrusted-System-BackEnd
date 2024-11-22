import { Injectable } from '@nestjs/common';
import { IFindProviderStrategy } from './find-providers-strategy.interface';
import { Provider } from '@/providers/models/providers.model';

@Injectable()
export class FindProviderByIdStrategy implements IFindProviderStrategy {
  async find(providerId: string): Promise<Provider[] | null> {
    return Provider.findAll({ 
      where: { id: providerId},
    });
  }
}
