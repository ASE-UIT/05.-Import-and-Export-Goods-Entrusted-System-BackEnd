import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ICreateProviderStrategy } from './create-provider-strategy.interface';
import { CreateProviderDto } from '@/providers/dtos/CreateProviderDto';
import { Provider } from '@/providers/models/provider.model';
import { UniqueConstraintError } from 'sequelize';

@Injectable()
export class CreateProviderStrategy implements ICreateProviderStrategy {
  async create(providerInfo: CreateProviderDto): Promise<Provider> {
    const provider = new Provider();
    provider.name = providerInfo.name;
    provider.email = providerInfo.email;
    provider.phone = providerInfo.phone;
    provider.address = providerInfo.address;
    provider.country = providerInfo.country;
    provider.status = providerInfo.status;
    provider.contactRepId = providerInfo.contactRepId;
    try {
      await provider.save();
      return provider;
    }
    catch(err) {
      console.error('Error occurred while creating provider:', err);
      if (err instanceof UniqueConstraintError) {
        throw new ConflictException(err.errors[0].message);
      }
    throw new InternalServerErrorException('Failed to create provider');
    }
  }
}


