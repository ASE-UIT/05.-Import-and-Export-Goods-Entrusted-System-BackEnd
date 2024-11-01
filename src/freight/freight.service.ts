import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Freight } from './models/freight.model';
import { Provider, ProviderStatus } from '@/providers/models/provider.model';
import { CreateFreightDto } from './dtos/CreateFreightDto';
import { UpdateFreightDto } from './dtos/UpdateFreightDto';
import { CreateFreightStrategy } from './strategies/create-freight/create-freight.strategy';
import { UpdateFreightStrategy } from './strategies/update-freight/update-freight.strategy';
import { FindFreightStrategy } from './strategies/find-freight/find-freight-strategy.enum';
import { IFindFreightStrategy } from './strategies/find-freight/find-freight-strategy.interface';
import { FindAllFreightStrategy } from './strategies/find-freight/find-all.strategy';
import { FindFreightByDestinationStrategy } from './strategies/find-freight/find-by-destination.strategy';
import { FindFreightByOriginStrategy } from './strategies/find-freight/find-by-origin.strategy';
import { FindFreightByTransitTimeStrategy } from './strategies/find-freight/find-by-transit-time.strategy';
import { FindFreightByTypeStrategy } from './strategies/find-freight/find-by-type.strategy';
import { FindFreightByValidFromStrategy } from './strategies/find-freight/find-by-valid-from.strategy';
import { FindFreightByValidUntilStrategy } from './strategies/find-freight/find-by-valid-until.strategy';
import { FindFreightByAdditionFeeStrategy } from './strategies/find-freight/find-by-add-fee.strategy';
import { FindFreightByAdditionFeeBreakdownStrategy } from './strategies/find-freight/find-by-add-fee-breakdown.strategy';
import { FindFreightByScheduleStrategy } from './strategies/find-freight/find-by-schedule.strategy';

@Injectable()
export class FreightService {
  constructor(
    private findFreightByAdditionalFeeStrategy: FindFreightByAdditionFeeStrategy,
    private findFreightByAdditionalFeeBreakdownStrategy: FindFreightByAdditionFeeBreakdownStrategy,
    private findFreightByDestinationStrategy: FindFreightByDestinationStrategy,
    private findFreightByOriginStrategy: FindFreightByOriginStrategy,
    private findFreightByTransitTimeStrategy: FindFreightByTransitTimeStrategy,
    private findFreightByTypeStrategy: FindFreightByTypeStrategy,
    private findFreightByValidFromStrategy: FindFreightByValidFromStrategy,
    private findFreightByValidUntilStrategy: FindFreightByValidUntilStrategy,
    private findFreightByScheduleStrategy: FindFreightByScheduleStrategy,
    private findAllFreightStrategy: FindAllFreightStrategy,
    private createFreightStrategy: CreateFreightStrategy,
    private updateFreightStrategy: UpdateFreightStrategy,
    @InjectModel(Provider)
    private readonly providerRepository: typeof Provider,
    @InjectModel(Freight)
    private readonly freightRepository: typeof Freight,
  ) {}

  async find(
    strategy: FindFreightStrategy,
    freightInfo: any,
  ): Promise<Freight[] | null> {
    const findStrategy = this.getFindStrategy(strategy);
    return findStrategy.find(freightInfo);
  }

  getFindStrategy(strategy: FindFreightStrategy): IFindFreightStrategy {
    switch (strategy) {
      case FindFreightStrategy.ALL:
        return this.findAllFreightStrategy;
      case FindFreightStrategy.ADDITIONAL_FEE:
        return this.findFreightByAdditionalFeeStrategy;
      case FindFreightStrategy.ADDITIONAL_FEE_BREAKDOWN:
        return this.findFreightByAdditionalFeeBreakdownStrategy;
      case FindFreightStrategy.DESTINATION:
        return this.findFreightByDestinationStrategy;
      case FindFreightStrategy.ORIGIN:
        return this.findFreightByOriginStrategy;
      case FindFreightStrategy.FREIGHT_TYPE:
        return this.findFreightByTypeStrategy;
      case FindFreightStrategy.TRANSIT_TIME:
        return this.findFreightByTransitTimeStrategy;
      case FindFreightStrategy.VALID_FROM:
        return this.findFreightByValidFromStrategy;
      case FindFreightStrategy.VALID_UNTIL:
        return this.findFreightByValidUntilStrategy;
      case FindFreightStrategy.SCHEDULE:
        return this.findFreightByScheduleStrategy;
    }
  }

  async create(freightInfo: CreateFreightDto): Promise<Freight> {
    await this.validateProviderForFreight(freightInfo.providerId);
    const createdFreight = await this.createFreightStrategy.create(freightInfo);
    await this.updateProviderStatus(freightInfo.providerId);
    return createdFreight;
  }

  async update(
    freightId: string,
    updateInfo: UpdateFreightDto,
  ): Promise<Freight> {
    if (Object.keys(updateInfo).length < 1) {
      throw new BadRequestException('Body is empty');
    }

    if (updateInfo.providerId) {
      await this.validateProviderForFreight(updateInfo.providerId);
    }

    const updatedFreight = await this.updateFreightStrategy.update(
      freightId,
      updateInfo,
    );

    if (updateInfo.providerId) {
      await this.updateProviderStatus(updateInfo.providerId);
    }

    return updatedFreight;
  }

  private async validateProviderForFreight(providerId: string): Promise<void> {
    const provider = await this.providerRepository.findByPk(providerId);

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    if (!provider.contactRepId) {
      throw new ConflictException(
        'Provider does not have a valid contact representative',
      );
    }

    if (provider.status !== ProviderStatus.ACTIVE) {
      throw new ConflictException(
        'Provider is not trustworthy for this freight',
      );
    }
  }

  private async updateProviderStatus(providerId: string): Promise<void> {
    const freightCount = await this.freightRepository.count({
      where: { providerId },
    });

    const provider = await this.providerRepository.findByPk(providerId);
    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    provider.status =
      freightCount >= 4 ? ProviderStatus.ACTIVE : ProviderStatus.INACTIVE;
    await provider.save();
  }
}
