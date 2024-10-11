import { CreateProviderDto } from '@/providers/dtos/CreateProviderDto';
import { Provider } from '@/providers/models/provider.model';

export interface ICreateProviderStrategy {
  create(providerInfo: CreateProviderDto): Promise<Provider>;
}
