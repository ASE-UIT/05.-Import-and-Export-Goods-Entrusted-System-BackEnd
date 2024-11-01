import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { FindProviderByNameStrategy } from './strategies/find-provider/find-by-name.strategy';
import { FindProviderByEmailStrategy } from './strategies/find-provider/find-by-email.strategy';
import { FindProviderByPhoneStrategy } from './strategies/find-provider/find-by-phone.strategy';
import { FindProviderStrategy } from './strategies/find-provider/find-provider-strategy.enum';
import { IFindProviderStrategy } from './strategies/find-provider/find-provider-strategy.interface';
import { Provider, ProviderStatus } from './models/provider.model';
import { FindAllProviderStrategy } from './strategies/find-provider/find-all.strategy';
import { CreateProviderStrategy } from './strategies/create-provider/create-provider.strategy';
import { CreateProviderDto } from './dtos/CreateProviderDto';
import { UpdateProviderStrategy } from './strategies/update-provider/update-provider.strategy';
import { FindProviderByAddressStrategy } from './strategies/find-provider/find-by-address.strategy';
import { FindProviderByCountryStrategy } from './strategies/find-provider/find-by-country.strategy';
import { FindProviderByContactRepIdStrategy } from './strategies/find-provider/find-by-contact-rep-id.strategy';
import { FindProviderByStatusStrategy } from './strategies/find-provider/find-by-status.strategy';
import { InjectModel } from '@nestjs/sequelize';
import { Freight } from '@/freight/models/freight.model';
import { Op } from 'sequelize';

@Injectable()
export class ProvidersService {
  constructor(
    private findProviderByAddressStrategy: FindProviderByAddressStrategy,
    private findProviderByCountryStrategy: FindProviderByCountryStrategy,
    private findProviderByNameStrategy: FindProviderByNameStrategy,
    private findProviderByEmailStrategy: FindProviderByEmailStrategy,
    private findProviderByPhoneStrategy: FindProviderByPhoneStrategy,
    private findProviderByContactRepIdStrategy: FindProviderByContactRepIdStrategy,
    private findProviderByStatusStrategy: FindProviderByStatusStrategy,
    private findAllProviderStrategy: FindAllProviderStrategy,
    private createProviderStrategy: CreateProviderStrategy,
    private updateProviderStrategy: UpdateProviderStrategy,
    @InjectModel(Freight)
    private readonly freightRepository: typeof Freight,
    @InjectModel(Provider) 
    private readonly providerRepository: typeof Provider,
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
      case FindProviderStrategy.ADDRESS:
        return this.findProviderByAddressStrategy;
      case FindProviderStrategy.COUNTRY:
        return this.findProviderByCountryStrategy;
      case FindProviderStrategy.CONTACT_REP_ID:
        return this.findProviderByContactRepIdStrategy;
      case FindProviderStrategy.STATUS:
        return this.findProviderByStatusStrategy;
    }
  }

  async createProvider(providerInfo: CreateProviderDto): Promise<Provider> {
    const contactRep = await this.providerRepository.findByPk(providerInfo.contactRepId);
    if (!contactRep) {
      throw new BadRequestException('Contact representative not found');
    }
    const provider = await this.createProviderStrategy.create(providerInfo);
    const isEligible = await this.checkFreightEligibility(provider.id);

    if (!isEligible) {
      provider.status = ProviderStatus.INACTIVE;
      await provider.save();
    }

    return provider;
  }

  async updateProvider(
    providerId: string,
    updateInfo: Partial<CreateProviderDto>,
  ): Promise<{ message: string; data: Provider }> {
    const updateResponse = await this.updateProviderStrategy.update(
      providerId,
      updateInfo,
    );
    await this.updateProviderStatus(providerId);
    return { message: 'Provider updated', data: updateResponse };
  }

  private async checkFreightEligibility(providerId: string): Promise<boolean> {
    const freightCount = await this.freightRepository.count({
      where: {
        provider_id: providerId,
        type: { [Op.in]: ['AIR', 'FCL', 'LCL', 'LAND'] },
      },
      distinct: true,
      col: 'type',
    });

    return freightCount >= 4;
  }

  private async updateProviderStatus(providerId: string): Promise<void> {
    const provider = await this.providerRepository.findByPk(providerId);
    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    const freightCount = await this.freightRepository.count({
      where: {
        providerId,
        type: { [Op.in]: ['AIR', 'FCL', 'LCL', 'LAND'] },
      },
      distinct: true,
      col: 'type',
    });

    provider.status = freightCount >= 4 ? ProviderStatus.ACTIVE : ProviderStatus.INACTIVE;
    await provider.save();
  }
}
