import { CreateProviderDto } from '@/providers/dtos/CreateProviderDto';

export interface ICreateProviderStrategy {
  create(providerInfo: CreateProviderDto): Promise<void>;
}
