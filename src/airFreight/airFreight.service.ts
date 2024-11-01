import { Injectable, BadRequestException } from '@nestjs/common';
import { AirFreight } from './models/airFreight.model';
import { CreateAirFreightStrategy } from './strategies/create-air-freight/create-air-freight.strategy';
import { CreateAirFreightDto } from './dtos/CreateAirFreightDto';
import { UpdateAirFreightStrategy } from './strategies/update-air-freight/update-air-freight.strategy';
import { FindAirFreightStrategy } from './strategies/find-air-freight/find-air-freight-strategy.enum';
import { IFindAirFreightStrategy } from './strategies/find-air-freight/find-air-freight-strategy.interface';
import { FindAllAirFreightStrategy } from './strategies/find-air-freight/find-all.strategy';
import { FindAirFreightByPrice45kStrategy } from './strategies/find-air-freight/find-by-price-45k.strategy';
import { FindAirFreightByPrice100kStrategy } from './strategies/find-air-freight/find-by-price-100k.strategy';
import { FindAirFreightByPrice300kStrategy } from './strategies/find-air-freight/find-by-price-300k.strategy';
import { FindAirFreightByPrice500kStrategy } from './strategies/find-air-freight/find-by-price-500k.strategy';
import { FindAirFreightByPrice0kStrategy } from './strategies/find-air-freight/find-by-price-0k.strategy';
import { FindAirFreightByFreightIdStrategy } from './strategies/find-air-freight/find-by-freight-id.strategy';


@Injectable()
export class AirFreightService {
  constructor(
    private findAirFreghtByPrice0kStrategy: FindAirFreightByPrice0kStrategy,
    private findAirFreightByPrice45kStrategy: FindAirFreightByPrice45kStrategy,
    private findAirFreightByPrice100kStrategy: FindAirFreightByPrice100kStrategy,
    private findAirFreightByPrice300kStrategy: FindAirFreightByPrice300kStrategy,
    private findAirFreightByPrice500kStrategy: FindAirFreightByPrice500kStrategy,
    private findAirFreightByFreightIdStrategy: FindAirFreightByFreightIdStrategy,
    private findAllAirFreightStrategy: FindAllAirFreightStrategy,
    private createAirFreightStrategy: CreateAirFreightStrategy,
    private updateAirFreightStrategy: UpdateAirFreightStrategy,
  ) {}

  find(
    strategy: FindAirFreightStrategy,
    airFreightInfo: any,
  ): Promise<AirFreight[] | null> {
    const findStrategy = this.getFindStrategy(strategy);
    const airFreight = findStrategy.find(airFreightInfo);
    return airFreight;
  }

  getFindStrategy(strategy: FindAirFreightStrategy): IFindAirFreightStrategy {
    switch (strategy) {
      case FindAirFreightStrategy.ALL:
        return this.findAllAirFreightStrategy;
      case FindAirFreightStrategy.PRICE_0K:
        return this.findAirFreghtByPrice0kStrategy;
      case FindAirFreightStrategy.PRICE_45K:
        return this.findAirFreightByPrice45kStrategy;
      case FindAirFreightStrategy.PRICE_100K:
        return this.findAirFreightByPrice100kStrategy;
      case FindAirFreightStrategy.PRICE_300K:
        return this.findAirFreightByPrice300kStrategy;
      case FindAirFreightStrategy.PRICE_500K:
        return this.findAirFreightByPrice500kStrategy;
      case FindAirFreightStrategy.FREIGHT_ID:
        return this.findAllAirFreightStrategy;
    }
  }

  async create(airFreightInfo: CreateAirFreightDto): Promise<AirFreight> {
    const createdAirFreight = await this.createAirFreightStrategy.create(airFreightInfo);
    return createdAirFreight;
  }

  async update(
    airFreightId: string,
    updateInfo: Partial<CreateAirFreightDto>,
  ): Promise<AirFreight> {
    if (Object.keys(updateInfo).length < 1) {
      throw new BadRequestException('Body is empty');
    }

    try {
      const updatedResponse = await this.updateAirFreightStrategy.update(
        airFreightId,
        updateInfo,
      );
      return updatedResponse;
    } catch (error) {
      throw new BadRequestException('Invalid data provided');
    }
  }
}
