import { UpdateProviderDto } from '@/providers/dtos/UpdateProviderDto';
import { Provider } from '@/providers/models/provider.model';

export interface IUpdateProviderStrategy {
  update(providerId: string, updateInfo: UpdateProviderDto): Promise<Provider>;
}
