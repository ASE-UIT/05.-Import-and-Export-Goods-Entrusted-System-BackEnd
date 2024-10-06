import { Injectable } from '@nestjs/common';
import { ICreateProviderStrategy } from './create-provider-strategy.interface';
import { CreateProviderDto } from '@/providers/dtos/CreateProviderDto';
import { Provider, ProviderStatus } from '@/providers/models/provider.model';

@Injectable()
export class CreateProviderStrategy implements ICreateProviderStrategy {
  async create(providerInfo: CreateProviderDto): Promise<void> {
    const provider = new Provider();
    provider.name = providerInfo.name;
    provider.email = providerInfo.email;
    provider.phone = providerInfo.phone;
    provider.address = providerInfo.address;
    provider.country = providerInfo.country;

    provider.status = providerInfo.status === 'active' 
      ? ProviderStatus.ACTIVE 
      : ProviderStatus.INACTIVE;

    await provider.save();
  }
}

