import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { LandFreight } from './models/landfreight.model';
import { FindLandFreightByPrice100_200Strategy } from './strategies/find-land-freight/find-by-price-100-200.strategy';
import { FindLandFreightByPrice200_500Strategy } from './strategies/find-land-freight/find-by-price-200-500.strategy';
import { FindLandFreightByPrice500_1500Strategy } from './strategies/find-land-freight/find-by-price-500-1500.strategy';
import { FindLandFreightByPrice1500_5000Strategy } from './strategies/find-land-freight/find-by-price-1500-5000.strategy';
import { FindLandFreightByPrice5000_10000Strategy } from './strategies/find-land-freight/find-by-price-5000-10000.strategy';
import { FindLandFreightByPrice10000Strategy } from './strategies/find-land-freight/find-by-price-10000.strategy';
import { FindLandFreightByFreightIdStrategy } from './strategies/find-land-freight/find-by-freight-id.strategy';
import { FindAllLandFreightStrategy } from './strategies/find-land-freight/find-all.strategy';
import { FindLandFreightStrategy } from './strategies/find-land-freight/find-land-freight-strategy.enum';
import { IFindLandFreightStrategy } from './strategies/find-land-freight/find-land-freight-strategy.interface';
import { CreateLandFreightStrategy } from './strategies/create-land-freight/create-land-freight.strategy';
import { CreateLandFreightDto } from './dtos/CreateLandFreightDto';
import { UpdateLandFreightStrategy } from './strategies/update-land-freight/update-land-freight.strategy';

@Injectable()
export class LandFreightService {
  constructor(
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

  async findLandFreight(
    strategy: FindLandFreightStrategy,
    landFreightInfo: string,
  ): Promise<LandFreight[] | null> {
    const findStrategy = this.getFindStrategy(strategy);
    const landFreight: LandFreight[] | null = await findStrategy.find(landFreightInfo);
    
    return landFreight;
  }

  getFindStrategy(strategy: FindLandFreightStrategy): IFindLandFreightStrategy {
    switch (strategy) {
      case FindLandFreightStrategy.ALL:
        return this.findAllLandFreightStrategy;
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

  async createLandFreight(landFreightInfo: CreateLandFreightDto): Promise<LandFreight> {
    return await this.createLandFreightStrategy.create(landFreightInfo);
  }

  async updateLandFreight(
    landFreightId: string,
    updateInfo: Partial<CreateLandFreightDto>, 
  ): Promise<{ message: string; data: LandFreight }> { 
    const updateResponse = await this.updateLandFreightStrategy.update(
      landFreightId,
      updateInfo,
    );
    return { message: 'Land Freight updated', data: updateResponse };
  }
}
