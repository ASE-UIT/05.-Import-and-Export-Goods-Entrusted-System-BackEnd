import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { Freight } from './models/freight.model';
import { FindFreightByDestinationStrategy } from './strategies/find-freight/find-by-destination.strategy';
import { FindFreightByOriginStrategy } from './strategies/find-freight/find-by-origin.strategy';
import { FindFreightByProviderIdStrategy } from './strategies/find-freight/find-by-provider-id.strategy';
import { FindFreightByTransitTimeStrategy } from './strategies/find-freight/find-by-transit-time.strategy';
import { FindFreightByTransitStrategy } from './strategies/find-freight/find-by-transit.strategy';
import { FindFreightByTypeStrategy } from './strategies/find-freight/find-by-type.strategy';
import { FindFreightByValidFromStrategy } from './strategies/find-freight/find-by-valid-from.strategy';
import { FindFreightByValidUntilStrategy } from './strategies/find-freight/find-by-valid-until.strategy';
import { FindAllFreightStrategy } from './strategies/find-freight/find-all.strategy';
import { FindFreightStrategy } from './strategies/find-freight/find-freight-strategy.enum';
import { IFindFreightStrategy } from './strategies/find-freight/find-freight-strategy.interface';
import { CreateFreightStrategy } from './strategies/create-freight/create-freight.strategy';
import { CreateFreightDto } from './dtos/CreateFreightDto';
import { UpdateFreightStrategy } from './strategies/update-freight/update-freight.strategy';
@Injectable()
export class FreightService {
  constructor(
    private findFreightByDestinationStrategy: FindFreightByDestinationStrategy,
    private findFreightByOriginStrategy: FindFreightByOriginStrategy,
    private findFreightByProviderIdStrategy: FindFreightByProviderIdStrategy,
    private findFreightByTransitStrategy: FindFreightByTransitStrategy,
    private findFreightByTransitTimeStrategy: FindFreightByTransitTimeStrategy,
    private findFreightByTypeStrategy: FindFreightByTypeStrategy,
    private findFreightByValidFromStrategy: FindFreightByValidFromStrategy,
    private findFreightByValidUntilStrategy: FindFreightByValidUntilStrategy,
    private findAllFreightStrategy: FindAllFreightStrategy,
    private createFreightStrategy: CreateFreightStrategy,
    private updateFreightStrategy: UpdateFreightStrategy,
  ) {}

  async findFreight(
    strategy: FindFreightStrategy,
    freightInfo: string,
  ): Promise<Freight[] | null> {
    const findStrategy = this.getFindStrategy(strategy);
    const freight: Freight[] | null = await findStrategy.find(freightInfo);
    
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
      case FindFreightStrategy.PROVIDER_ID:
        return this.findFreightByProviderIdStrategy;
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

  async createFreight(freightInfo: CreateFreightDto): Promise<Freight> {
    return await this.createFreightStrategy.create(freightInfo);
  }

//   async checkDuplicate(name: string): Promise<boolean> {
//     const exists = await Freight.findOne({ where: { name } });
//     return exists !== null;
//   }

  async updateFreight(
    freightId: string,
    updateInfo: Partial<CreateFreightDto>,
  ): Promise<{message: string; data: Freight}> {
    const updateResponse = await this.updateFreightStrategy.update(
      freightId,
      updateInfo,
    );
    return { message: 'Freight created', data: updateResponse};
  }
}
