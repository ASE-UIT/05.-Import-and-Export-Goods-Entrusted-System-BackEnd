import { Injectable } from '@nestjs/common';
import { IFindProviderStrategy } from './find-provider-strategy.interface';
import { Provider } from '../../models/provider.model';

@Injectable()
export class FindAllProviderStrategy implements IFindProviderStrategy {
  async find(): Promise<Provider[]> {
    return await Provider.findAll();
  }
}
