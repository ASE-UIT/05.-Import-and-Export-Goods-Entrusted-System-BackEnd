import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateLclDto } from './dtos/CreateLclDto';
import { LCL } from './models/lcl.model';
import { CreateLclStrategy } from './strategies/create-lcl/create-lcl.strategy';
import { FindAllLclStrategy } from './strategies/find-lcl/find-all.strategy';
import { FindLclStrategy } from './strategies/find-lcl/find-lcl-strategy.enum';
import { IFindLclStrategy } from './strategies/find-lcl/find-lcl-strategy.interface';
import { UpdateLclStrategy } from './strategies/update-lcl/update-lcl.strategy';
import { FindLclByCostStrategy } from './strategies/find-lcl/find-by-cost.strategy';
import { FindLclByFreightIdStrategy } from './strategies/find-lcl/find-by-freight-id.strategy';

@Injectable()
export class LCLService {
  constructor(
    private findLclByCostStrategy: FindLclByCostStrategy,
    private findLclByFreightIdStrategy: FindLclByFreightIdStrategy,
    private findAllLclStrategy: FindAllLclStrategy,
    private createLclStrategy: CreateLclStrategy,
    private updateLclStrategy: UpdateLclStrategy,
  ) {}

  find(
    strategy: FindLclStrategy,
    landFreightInfo: any,
  ): Promise<LCL[] | null> {
    const findStrategy = this.getFindStrategy(strategy);
    const lcl = findStrategy.find(landFreightInfo);
    return lcl;
  }

  getFindStrategy(strategy: FindLclStrategy): IFindLclStrategy {
    switch (strategy) {
      case FindLclStrategy.ALL:
        return this.findAllLclStrategy;
      case FindLclStrategy.COST:
        return this.findLclByCostStrategy;
      case FindLclStrategy.FREIGHT_ID:
        return this.findLclByFreightIdStrategy;
    }
  }

  async create(lclInfo: CreateLclDto): Promise<LCL> {
    const createdLcl = await this.createLclStrategy.create(lclInfo);
    return createdLcl;
  }

  async update(
    lcl_Id: string,
    updateInfo: Partial<CreateLclDto>,
  ): Promise<LCL> {
    if (Object.keys(updateInfo).length < 1) {
      throw new BadRequestException('Body is empty');
    }

    try {
      const updatedResponse = await this.updateLclStrategy.update(
        lcl_Id,
        updateInfo,
      );
      return updatedResponse;
    } catch (error) {
      throw new BadRequestException('Invalid data provided');
    }
  }
}