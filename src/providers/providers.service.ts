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
import { UpdateProviderDto } from './dtos/UpdateProviderDto';

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
    if (!providerInfo || providerInfo.trim().length === 0) {
      throw new BadRequestException('Provider information cannot be empty');
    }

    const findStrategy = this.getFindStrategy(strategy);
    const provider: Provider[] = await findStrategy.find(providerInfo);
    if (!provider || provider.length === 0) {
      throw new NotFoundException('No providers found with the given information');
    }

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
      default:
        throw new BadRequestException(`Invalid provider strategy: ${strategy}`);
    }
  }

  async createProvider(providerInfo: CreateProviderDto): Promise<void> {
    if (!providerInfo || Object.keys(providerInfo).length === 0) {
      throw new BadRequestException('Provider data cannot be empty');
    }

    const providerExists = await this.checkDuplicate(providerInfo.name);
    if (!providerExists) {
      return await this.createProviderStrategy.create(providerInfo);
    } else {
      throw new ConflictException('Provider already exists');
    }
  }

  async checkDuplicate(name: string): Promise<boolean> {
    const exists = await Provider.findOne({ where: { name } });
    return exists !== null;
  }

  async updateProvider(
    providerId: string,
    updateInfo: UpdateProviderDto,
  ): Promise<Provider> {
    if (!updateInfo || Object.keys(updateInfo).length === 0) {
      throw new BadRequestException('Update data cannot be empty');
    }

    const providerExists = await Provider.findByPk(providerId);
    if (!providerExists) {
      throw new NotFoundException(`Provider with ID ${providerId} not found`);
    }

    return await this.updateProviderStrategy.update(providerId, updateInfo);
  }
}
