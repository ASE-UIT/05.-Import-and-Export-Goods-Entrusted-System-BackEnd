import { Provider } from '@/providers/models/providers.model';

export interface IFindProviderStrategy {
  find(providerInfo: string): Promise<Provider[] | null>;
}
