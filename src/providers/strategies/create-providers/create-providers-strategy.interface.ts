import { CreateProviderDto } from '@/providers/dtos/create-providers.dto';
import { Provider } from '@/providers/models/providers.model';

export interface ICreateProviderStrategy {
  create(providerInfo: CreateProviderDto): Promise<Provider>;
}
