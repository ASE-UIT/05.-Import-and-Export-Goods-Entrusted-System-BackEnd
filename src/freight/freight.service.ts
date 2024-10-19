import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { Freight } from './models/freight.model';
import { CreateFreightStrategy } from './strategies/create-freight/create-freight.strategy';
import { CreateFreightDto } from './dtos/CreateFreightDto';
import { UpdateFreightStrategy } from './strategies/update-freight/update-freight.strategy';
import { UpdateFreightDto } from './dtos/UpdateFreightDto';
import { FindFreightStrategy } from './strategies/find-freight/find-freight-strategy.enum';
import { IFindFreightStrategy } from './strategies/find-freight/find-freight-strategy.interface';
import { FindAllFreightStrategy } from './strategies/find-freight/find-all.strategy';
import { FindFreightByDestinationStrategy } from './strategies/find-freight/find-by-destination.strategy';
import { FindFreightByOriginStrategy } from './strategies/find-freight/find-by-origin.strategy';
import { FindFreightByTransitTimeStrategy } from './strategies/find-freight/find-by-transit-time.strategy';
import { FindFreightByTransitStrategy } from './strategies/find-freight/find-by-transit.strategy';
import { FindFreightByTypeStrategy } from './strategies/find-freight/find-by-type.strategy';
import { FindFreightByValidFromStrategy } from './strategies/find-freight/find-by-valid-from.strategy';
import { FindFreightByValidUntilStrategy } from './strategies/find-freight/find-by-valid-until.strategy';

@Injectable()
export class FreightService {
  constructor(
    private findFreightByDestinationStrategy: FindFreightByDestinationStrategy,
    private findFreightByOriginStrategy: FindFreightByOriginStrategy,
    private findFreightByTransitStrategy: FindFreightByTransitStrategy,
    private findFreightByTransitTimeStrategy: FindFreightByTransitTimeStrategy,
    private findFreightByTypeStrategy: FindFreightByTypeStrategy,
    private findFreightByValidFromStrategy: FindFreightByValidFromStrategy,
    private findFreightByValidUntilStrategy: FindFreightByValidUntilStrategy,
    private findAllFreightStrategy: FindAllFreightStrategy,
    private createFreightStrategy: CreateFreightStrategy,
    private updateFreightStrategy: UpdateFreightStrategy,
  ) {}

  find(
    strategy: FindFreightStrategy,
    freightInfo: any,
  ): Promise<Freight[] | null> {
    const findStrategy = this.getFindStrategy(strategy);
    const freight = findStrategy.find(freightInfo);
    return freight;
  }

  getFindStrategy(strategy: FindFreightStrategy): IFindFreightStrategy {
    switch (strategy) {
      case FindFreightStrategy.ALL:
        return this.findAllFreightStrategy;
      case FindFreightStrategy.DESTINATION:
        return this.findFreightByDestinationStrategy;
      case FindFreightStrategy.ORIGIN:
        return this.findFreightByOriginStrategy;
      case FindFreightStrategy.FREIGHT_TYPE:
        return this.findFreightByTypeStrategy;
      case FindFreightStrategy.TRANSIT:
        return this.findFreightByTransitStrategy;
      case FindFreightStrategy.TRANSIT_TIME:
        return this.findFreightByTransitTimeStrategy;
      case FindFreightStrategy.VALID_FROM:
        return this.findFreightByValidFromStrategy;
      case FindFreightStrategy.VALID_UNTIL:
        return this.findFreightByValidUntilStrategy;
    }
  }

  async create(freightInfo: CreateFreightDto): Promise<Freight> {
    const createdFreight = await this.createFreightStrategy.create(freightInfo);
    return createdFreight;
  }

  async update(
    freightId: string,
    updateInfo: UpdateFreightDto,
  ): Promise<Freight> {
    if (Object.keys(updateInfo).length < 1) {
      throw new BadRequestException('Body is empty');
    }

    try {
      const updatedResponse = await this.updateFreightStrategy.update(
        freightId,
        updateInfo,
      );
      return updatedResponse;
    } catch (error) {
      throw new BadRequestException('Invalid data provided');
    }
  }
}
