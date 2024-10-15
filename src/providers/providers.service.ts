import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { FindProviderByNameStrategy } from './strategies/find-provider/find-by-name.strategy';
import { FindProviderByEmailStrategy } from './strategies/find-provider/find-by-email.strategy';
import { FindProviderByPhoneStrategy } from './strategies/find-provider/find-by-phone.strategy';
import { FindProviderByCountryStrategy } from './strategies/find-provider/find-by-country.strategy'; 
import { FindProviderByAddressStrategy } from './strategies/find-provider/find-by-address.strategy'; 
import { FindProviderStrategy } from './strategies/find-provider/find-provider-strategy.enum';
import { IFindProviderStrategy } from './strategies/find-provider/find-provider-strategy.interface';
import { Provider } from './models/provider.model';
import { FindAllProviderStrategy } from './strategies/find-provider/find-all.strategy';
import { CreateProviderStrategy } from './strategies/create-provider/create-provider.strategy';
import { CreateProviderDto } from './dtos/CreateProviderDto';
import { UpdateProviderStrategy } from './strategies/update-provider/update-provider.strategy';

@Injectable()
export class ProvidersService {
  constructor(
    private findProviderByNameStrategy: FindProviderByNameStrategy,
    private findProviderByEmailStrategy: FindProviderByEmailStrategy,
    private findProviderByPhoneStrategy: FindProviderByPhoneStrategy,
    private findProviderByCountryStrategy: FindProviderByCountryStrategy,
    private findProviderByAddressStrategy: FindProviderByAddressStrategy,
    private findAllProviderStrategy: FindAllProviderStrategy,
    private createProviderStrategy: CreateProviderStrategy,
    private updateProviderStrategy: UpdateProviderStrategy, 
  ) {}

  async findProvider(
    strategy: FindProviderStrategy,
    providerInfo: string,
  ): Promise<Provider[] | null> {
    const findStrategy = this.getFindStrategy(strategy);
    const provider: Provider[] | null = await findStrategy.find(providerInfo);
    
    return provider;
  }

  getFindStrategy(strategy: FindProviderStrategy): IFindProviderStrategy {
    switch (strategy) {
      case FindProviderStrategy.ALL:
        return this.findAllProviderStrategy;
      case FindProviderStrategy.EMAIL:
        return this.findProviderByEmailStrategy;
      case FindProviderStrategy.NAME:
        return this.findProviderByNameStrategy;
      case FindProviderStrategy.PHONE:
        return this.findProviderByPhoneStrategy;
      case FindProviderStrategy.COUNTRY:
        return this.findProviderByCountryStrategy;
      case FindProviderStrategy.ADDRESS:
        return this.findProviderByAddressStrategy;
    }
  }

  async createProvider(providerInfo: CreateProviderDto): Promise<Provider> {
    return await this.createProviderStrategy.create(providerInfo);
  }

  async checkDuplicate(name: string): Promise<boolean> {
    const exists = await Provider.findOne({ where: { name } });
    return exists !== null;
  }

  async updateProvider(
    providerId: string,
    updateInfo: Partial<CreateProviderDto>,
  ): Promise<{message: string; data: Provider}> {
    const updateResponse = await this.updateProviderStrategy.update(
      providerId,
      updateInfo,
    );
    return { message: 'Provider created', data: updateResponse};
  }
}
