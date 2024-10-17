import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateSeaFreightDto } from './dtos/CreateSeaFreightDto';
import { SeaFreight } from './models/seaFreight.model';
import { CreateSeaFreightStrategy } from './strategies/create-sea-freight/create-sea-freight.strategy';
import { FindAllSeaFreightStrategy } from './strategies/find-sea-freight/find-all.strategy';
import { FindSeaFreightByFreightIdStrategy } from './strategies/find-sea-freight/find-by-freight-id.strategy';
import { FindSeaFreightByPrice20dcStrategy } from './strategies/find-sea-freight/find-by-price-20dc.strategy';
import { FindSeaFreightByPrice20rfStrategy } from './strategies/find-sea-freight/find-by-price-20rf.strategy';
import { FindSeaFreightByPrice40dcStrategy } from './strategies/find-sea-freight/find-by-price-40dc.strategy';
import { FindSeaFreightByPrice40hcStrategy } from './strategies/find-sea-freight/find-by-price-40hc.strategy';
import { FindSeaFreightByPrice40rfStrategy } from './strategies/find-sea-freight/find-by-price-40rf.strategy';
import { FindSeaFreightStrategy } from './strategies/find-sea-freight/find-sea-freight-strategy.enum';
import { IFindSeaFreightStrategy } from './strategies/find-sea-freight/find-sea-freight-strategy.interface';
import { UpdateSeaFreightStrategy } from './strategies/update-sea-freight/update-sea-freight.strategy';


@Injectable()
export class SeaFreightService {
  constructor(
    private findSeaFreightByPrice20dcStrategy: FindSeaFreightByPrice20dcStrategy,
    private findSeaFreightByPrice20rfStrategy: FindSeaFreightByPrice20rfStrategy,
    private findSeaFreightByFreightIdStrategy: FindSeaFreightByFreightIdStrategy,
    private findSeaFreightByPrice40dcStrategy: FindSeaFreightByPrice40dcStrategy,
    private findSeaFreightByPrice40hcStrategy: FindSeaFreightByPrice40hcStrategy,
    private findSeaFreightByPrice40rfStrategy: FindSeaFreightByPrice40rfStrategy,
    private findAllSeaFreightStrategy: FindAllSeaFreightStrategy,
    private createSeaFreightStrategy: CreateSeaFreightStrategy,
    private updateSeaFreightStrategy: UpdateSeaFreightStrategy,
  ) {}

  find(
    strategy: FindSeaFreightStrategy,
    seaFreightInfo: any,
  ): Promise<SeaFreight[]> {
    const findStrategy = this.getFindStrategy(strategy);
    const seaFreight = findStrategy.find(seaFreightInfo);
    
    return seaFreight;
  }

  getFindStrategy(strategy: FindSeaFreightStrategy): IFindSeaFreightStrategy {
    switch (strategy) {
      case FindSeaFreightStrategy.ALL:
        return this.findAllSeaFreightStrategy;
      case FindSeaFreightStrategy.PRICE_20DC:
        return this.findSeaFreightByPrice20dcStrategy;
      case FindSeaFreightStrategy.PRICE_40DC:
        return this.findSeaFreightByPrice40dcStrategy;
      case FindSeaFreightStrategy.PRICE_20RF:
        return this.findSeaFreightByPrice20rfStrategy;
      case FindSeaFreightStrategy.PRICE_40HC:
        return this.findSeaFreightByPrice40hcStrategy;
      case FindSeaFreightStrategy.PRICE_40RF:
        return this.findSeaFreightByPrice40rfStrategy;
    }
  }

  async create(seaFreightInfo: CreateSeaFreightDto): Promise<{message: string; data: SeaFreight}> {
    const createdSeaFreight = await this.createSeaFreightStrategy.create(seaFreightInfo);
    return { message: 'Sea freight created', data: createdSeaFreight };
  }

  async update(
    seaFreightId: string,
    updateInfo: Partial<CreateSeaFreightDto>, 
  ): Promise<{message: string; data: SeaFreight}> { 
    if (Object.keys(updateInfo).length < 1) {
      throw new BadRequestException('Body is empty');
    }
    const updateResponse = await this.updateSeaFreightStrategy.update(
      seaFreightId,
      updateInfo,
    );
    return { message: 'Sea Freight updated', data: updateResponse}; 
  }
}
