import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { AirFreight } from './models/airfreight.model'; 
import { FindAirFreightByPrice45kStrategy } from './strategies/find-air-freight/find-by-price-45k.strategy'; 
import { FindAirFreightByPrice100kStrategy } from './strategies/find-air-freight/find-by-price-100k.strategy'; 
import { FindAirFreightByPrice300kStrategy } from './strategies/find-air-freight/find-by-price-300k.strategy'; 
import { FindAirFreightByPrice500kStrategy } from './strategies/find-air-freight/find-by-price-500k.strategy'; 
import { FindAirFreightByFscStrategy } from './strategies/find-air-freight/find-by-fsc.strategy'; 
import { FindAirFreightByAmsFeesStrategy } from './strategies/find-air-freight/find-by-ams-fees.strategy'; 
import { FindAirFreightBySccStrategy } from './strategies/find-air-freight/find-by-scc.strategy'; 
import { FindAirFreightByRoutineStrategy } from './strategies/find-air-freight/find-by-routine.strategy'; 
import { FindAirFreightByFreightIdStrategy } from './strategies/find-air-freight/find-by-freight-id.strategy';
import { FindAllAirFreightStrategy } from './strategies/find-air-freight/find-all.strategy'; 
import { FindAirFreightStrategy } from './strategies/find-air-freight/find-air-freight-strategy.enum';
import { IFindAirFreightStrategy } from './strategies/find-air-freight/find-air-freight-strategy.interface';
import { CreateAirFreightStrategy } from './strategies/create-air-freight/create-air-freight.strategy'; 
import { CreateAirFreightDto } from './dtos/CreateAirFreightDto';
import { UpdateAirFreightStrategy } from './strategies/update-air-freight/update-air-freight.strategy'; 

@Injectable()
export class AirFreightService {
  constructor(
    private findAirFreightByPrice45kStrategy: FindAirFreightByPrice45kStrategy,
    private findAirFreightByPrice100kStrategy: FindAirFreightByPrice100kStrategy,
    private findAirFreightByPrice300kStrategy: FindAirFreightByPrice300kStrategy,
    private findAirFreightByPrice500kStrategy: FindAirFreightByPrice500kStrategy,
    private findAirFreightByFscStrategy: FindAirFreightByFscStrategy,
    private findAirFreightByAmsFeesStrategy: FindAirFreightByAmsFeesStrategy,
    private findAirFreightBySccStrategy: FindAirFreightBySccStrategy,
    private findAirFreightByRoutineStrategy: FindAirFreightByRoutineStrategy,
    private findAirFreightByFreightIdStrategy: FindAirFreightByFreightIdStrategy,
    private findAllAirFreightStrategy: FindAllAirFreightStrategy,
    private createAirFreightStrategy: CreateAirFreightStrategy,
    private updateAirFreightStrategy: UpdateAirFreightStrategy,
  ) {}

  async findAirFreight(
    strategy: FindAirFreightStrategy,
    airFreightInfo: string,
  ): Promise<AirFreight[] | null> {
    const findStrategy = this.getFindStrategy(strategy);
    const airFreight: AirFreight[] | null = await findStrategy.find(airFreightInfo);
    
    return airFreight;
  }

  getFindStrategy(strategy: FindAirFreightStrategy): IFindAirFreightStrategy {
    switch (strategy) {
      case FindAirFreightStrategy.ALL:
        return this.findAllAirFreightStrategy;
      case FindAirFreightStrategy.PRICE_45K:
        return this.findAirFreightByPrice45kStrategy;
      case FindAirFreightStrategy.PRICE_100K:
        return this.findAirFreightByPrice100kStrategy;
      case FindAirFreightStrategy.PRICE_300K:
        return this.findAirFreightByPrice300kStrategy;
      case FindAirFreightStrategy.PRICE_500K:
        return this.findAirFreightByPrice500kStrategy;
      case FindAirFreightStrategy.FSC:
        return this.findAirFreightByFscStrategy;
      case FindAirFreightStrategy.AMS_FEES:
        return this.findAirFreightByAmsFeesStrategy;
      case FindAirFreightStrategy.SCC:
        return this.findAirFreightBySccStrategy;
      case FindAirFreightStrategy.ROUTINE:
        return this.findAirFreightByRoutineStrategy;
      case FindAirFreightStrategy.FREIGHT_ID:
        return this.findAirFreightByFreightIdStrategy;
    }
  }

  async createAirFreight(airFreightInfo: CreateAirFreightDto): Promise<AirFreight> {
    return await this.createAirFreightStrategy.create(airFreightInfo);
  }

  async updateAirFreight(
    airFreightId: string,
    updateInfo: Partial<CreateAirFreightDto>, 
  ): Promise<{message: string; data: AirFreight}> { 
    const updateResponse = await this.updateAirFreightStrategy.update(
      airFreightId,
      updateInfo,
    );
    return { message: 'Air Freight updated', data: updateResponse}; 
  }
}
