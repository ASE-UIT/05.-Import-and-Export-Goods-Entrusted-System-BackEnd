import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { LandFreight } from './models/landFreight.model';
import { FindLandFreightByPrice100_200Strategy } from './strategies/find-land-freight/find-by-price-100-200.strategy';
import { FindLandFreightByPrice200_500Strategy } from './strategies/find-land-freight/find-by-price-200-500.strategy';
import { FindLandFreightByPrice500_1500Strategy } from './strategies/find-land-freight/find-by-price-500-1500.strategy';
import { FindLandFreightByPrice1500_5000Strategy } from './strategies/find-land-freight/find-by-price-1500-5000.strategy';
import { FindLandFreightByPrice5000_10000Strategy } from './strategies/find-land-freight/find-by-price-5000-10000.strategy';
import { FindLandFreightByPrice10000Strategy } from './strategies/find-land-freight/find-by-price-10000.strategy';
import { FindAllLandFreightStrategy } from './strategies/find-land-freight/find-all.strategy';
import { FindLandFreightStrategy } from './strategies/find-land-freight/find-land-freight-strategy.enum';
import { IFindLandFreightStrategy } from './strategies/find-land-freight/find-land-freight-strategy.interface';
import { CreateLandFreightStrategy } from './strategies/create-land-freight/create-land-freight.strategy';
import { CreateLandFreightDto } from './dtos/CreateLandFreightDto';
import { UpdateLandFreightStrategy } from './strategies/update-land-freight/update-land-freight.strategy';
import { FindLandFreightByPrice0_100Strategy } from './strategies/find-land-freight/find-by-price-0-100.strategy';
import { FindLandFreightByFreightIdStrategy } from './strategies/find-land-freight/find-by-freight-id.strategy';
@Injectable()
export class LandFreightService {
  constructor(
    private findLandFreightByPrice0_100Strategy: FindLandFreightByPrice0_100Strategy,
    private findLandFreightByPrice100_200Strategy: FindLandFreightByPrice100_200Strategy,
    private findLandFreightByPrice200_500Strategy: FindLandFreightByPrice200_500Strategy,
    private findLandFreightByPrice500_1500Strategy: FindLandFreightByPrice500_1500Strategy,
    private findLandFreightByPrice1500_5000Strategy: FindLandFreightByPrice1500_5000Strategy,
    private findLandFreightByPrice5000_10000Strategy: FindLandFreightByPrice5000_10000Strategy,
    private findLandFreightByPrice10000Strategy: FindLandFreightByPrice10000Strategy,
    private findLandFreightByFreightIdStrategy: FindLandFreightByFreightIdStrategy,
    private findAllLandFreightStrategy: FindAllLandFreightStrategy,
    private createLandFreightStrategy: CreateLandFreightStrategy,
    private updateLandFreightStrategy: UpdateLandFreightStrategy,
  ) {}

  find(
    strategy: FindLandFreightStrategy,
    landFreightInfo: any,
  ): Promise<LandFreight[] | null> {
    const findStrategy = this.getFindStrategy(strategy);
    const landFreight = findStrategy.find(landFreightInfo);
    return landFreight;
  }

  getFindStrategy(strategy: FindLandFreightStrategy): IFindLandFreightStrategy {
    switch (strategy) {
      case FindLandFreightStrategy.ALL:
        return this.findAllLandFreightStrategy;
      case FindLandFreightStrategy.PRICE_0_100:
        return this.findLandFreightByPrice0_100Strategy;
      case FindLandFreightStrategy.PRICE_100_200:
        return this.findLandFreightByPrice100_200Strategy;
      case FindLandFreightStrategy.PRICE_200_500:
        return this.findLandFreightByPrice200_500Strategy;
      case FindLandFreightStrategy.PRICE_500_1500:
        return this.findLandFreightByPrice500_1500Strategy;
      case FindLandFreightStrategy.PRICE_1500_5000:
        return this.findLandFreightByPrice1500_5000Strategy;
      case FindLandFreightStrategy.PRICE_5000_10000:
        return this.findLandFreightByPrice5000_10000Strategy;
      case FindLandFreightStrategy.PRICE_10000:
        return this.findLandFreightByPrice10000Strategy;
      case FindLandFreightStrategy.FREIGHT_ID:
        return this.findLandFreightByFreightIdStrategy;
    }
  }

  async create(landFreightInfo: CreateLandFreightDto): Promise<LandFreight> {
    const createdLandFreight = await this.createLandFreightStrategy.create(landFreightInfo);
    return createdLandFreight;
  }

  async update(
    landFreightId: string,
    updateInfo: Partial<CreateLandFreightDto>,
  ): Promise<LandFreight> {
    if (Object.keys(updateInfo).length < 1) {
      throw new BadRequestException('Body is empty');
    }

    try {
      const updatedResponse = await this.updateLandFreightStrategy.update(
        landFreightId,
        updateInfo,
      );
      return updatedResponse;
    } catch (error) {
      throw new BadRequestException('Invalid data provided');
    }
  }
}
