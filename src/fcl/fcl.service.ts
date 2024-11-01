import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateFclDto } from './dtos/CreateFclDto';
import { FCL } from './models/fcl.model';
import { CreateFclStrategy } from './strategies/create-fcl/create-fcl.strategy';
import { FindAllFclStrategy } from './strategies/find-fcl/find-all.strategy';
import { FindFclByPrice20dcStrategy } from './strategies/find-fcl/find-by-price-20dc.strategy';
import { FindFclByPrice20rfStrategy } from './strategies/find-fcl/find-by-price-20rf.strategy';
import { FindFclByPrice40dcStrategy } from './strategies/find-fcl/find-by-price-40dc.strategy';
import { FindFclByPrice40hcStrategy } from './strategies/find-fcl/find-by-price-40hc.strategy';
import { FindFclByPrice40rfStrategy } from './strategies/find-fcl/find-by-price-40rf.strategy';
import { FindFclStrategy } from './strategies/find-fcl/find-fcl-strategy.enum';
import { IFindFclStrategy } from './strategies/find-fcl/find-fcl-strategy.interface';
import { UpdateFclStrategy } from './strategies/update-fcl/update-fcl.strategy';
import { FindFclByFreightIdStrategy } from './strategies/find-fcl/find-by-freight-id.strategy';


@Injectable()
export class FCLService {
  constructor(
    private findFclByPrice20dcStrategy: FindFclByPrice20dcStrategy,
    private findFclByPrice20rfStrategy: FindFclByPrice20rfStrategy,
    private findFclByPrice40dcStrategy: FindFclByPrice40dcStrategy,
    private findFclByPrice40hcStrategy: FindFclByPrice40hcStrategy,
    private findFclByPrice40rfStrategy: FindFclByPrice40rfStrategy,
    private findFclByFreightIdStrategy: FindFclByFreightIdStrategy,
    private findAllFclStrategy: FindAllFclStrategy,
    private createFclStrategy: CreateFclStrategy,
    private updateFclStrategy: UpdateFclStrategy,
  ) {}

  find(
    strategy: FindFclStrategy,
    landFreightInfo: any,
  ): Promise<FCL[] | null> {
    const findStrategy = this.getFindStrategy(strategy);
    const fcl = findStrategy.find(landFreightInfo);
    return fcl;
  }

  getFindStrategy(strategy: FindFclStrategy): IFindFclStrategy {
    switch (strategy) {
      case FindFclStrategy.ALL:
        return this.findAllFclStrategy;
      case FindFclStrategy.PRICE_20DC:
        return this.findFclByPrice20dcStrategy;
      case FindFclStrategy.PRICE_20RF:
        return this.findFclByPrice20rfStrategy;
      case FindFclStrategy.PRICE_40DC:
        return this.findFclByPrice40dcStrategy;
      case FindFclStrategy.PRICE_40HC:
        return this.findFclByPrice40hcStrategy;
      case FindFclStrategy.PRICE_40RF:
        return this.findFclByPrice40rfStrategy;
      case FindFclStrategy.FREIGHT_ID:
        return this.findFclByFreightIdStrategy;
    }
}

  async create(fclInfo: CreateFclDto): Promise<FCL> {
    const createdFcl = await this.createFclStrategy.create(fclInfo);
    return createdFcl;
  }

  async update(
    fcl_Id: string,
    updateInfo: Partial<CreateFclDto>,
  ): Promise<FCL> {
    if (Object.keys(updateInfo).length < 1) {
      throw new BadRequestException('Body is empty');
    }

    try {
      const updatedResponse = await this.updateFclStrategy.update(
        fcl_Id,
        updateInfo,
      );
      return updatedResponse;
    } catch (error) {
      throw new BadRequestException('Invalid data provided');
    }
  }
}