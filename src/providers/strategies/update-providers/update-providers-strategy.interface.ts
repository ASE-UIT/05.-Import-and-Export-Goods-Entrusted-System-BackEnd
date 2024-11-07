import { CreateProviderDto } from '@/providers/dtos/create-providers.dto';
import { Provider } from '@/providers/models/providers.model';

export interface IUpdateProviderStrategy {
  update(
    providerId: string,
    updateInfo: Partial<CreateProviderDto>,
  ): Promise<Provider>;
}
