import { Provider } from '@/providers/models/provider.model';

export interface IFindProviderStrategy {
  find(providerInfo: string): Promise<Provider[]>;
}
