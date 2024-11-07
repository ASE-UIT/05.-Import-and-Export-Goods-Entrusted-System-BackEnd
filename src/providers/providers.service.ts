import { ConflictException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { Provider, ProviderStatus } from './models/providers.model';
import { CreateProviderStrategy } from './strategies/create-providers/create-providers.strategy';
import { CreateProviderDto, UpdateProviderDto } from './dtos/create-providers.dto';
import { UpdateProviderStrategy } from './strategies/update-providers/update-providers.strategy';
import { InjectModel } from '@nestjs/sequelize';
import { Freight } from '@/freights/models/freights.model';
import { Op } from 'sequelize';
import { QueryProviderDto } from './dtos/query-providers.dto';

@Injectable()
export class ProvidersService {
  constructor(
    private createProviderStrategy: CreateProviderStrategy,
    private updateProviderStrategy: UpdateProviderStrategy,
    @InjectModel(Freight)
    private readonly freightRepository: typeof Freight,
    @InjectModel(Provider) 
    private readonly providerRepository: typeof Provider,
  ) {}

  async findProvider(providerInfo: QueryProviderDto): Promise<Provider[]> {
    let provider: Provider[];
    if (providerInfo) {
      provider = await Provider.findAll({ where: providerInfo });
    } else {
      provider = await Provider.findAll();
    }
    if (provider.length > 0) return provider;
    else throw new NotFoundException('Provider not found');
  }

  async createProvider(providerInfo: CreateProviderDto): Promise<Provider> {
    return await this.createProviderStrategy.create(providerInfo);
  }

  async updateProvider(providerId: string, updateInfo: UpdateProviderDto): Promise<Provider> {
    const updateResponse = await this.updateProviderStrategy.update(providerId, updateInfo);
    return updateResponse;
  }
}

