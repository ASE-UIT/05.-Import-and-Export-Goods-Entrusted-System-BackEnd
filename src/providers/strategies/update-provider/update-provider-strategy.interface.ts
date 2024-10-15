import { CreateProviderDto } from '@/providers/dtos/CreateProviderDto';
import { Provider } from '@/providers/models/provider.model';

export interface IUpdateProviderStrategy {
  update(
    providerId: string,
    updateInfo: Partial<CreateProviderDto>,
  ): Promise<Provider>;
}
