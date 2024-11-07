import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';

import { LandFreight } from './models/land-freights.model';
import { CreateLandFreightStrategy } from './strategies/create-land-freights/create-land-freights.strategy';
import { CreateLandFreightDto, UpdateLandFreightDto } from './dtos/create-land-freights.dto';
import { UpdateLandFreightStrategy } from './strategies/update-land-freights/update-land-freights.strategy';
import { QueryLandFreightDto } from './dtos/query-land-freights.dto';
@Injectable()
export class LandFreightService {
  constructor(
    private createLandFreightStrategy: CreateLandFreightStrategy,
    private updateLandFreightStrategy: UpdateLandFreightStrategy,
  ) {}

  async find(landFreightInfo: QueryLandFreightDto,
  ): Promise<LandFreight[]> {
    let landFreight: LandFreight[];
    if (landFreightInfo) {
      landFreight = await LandFreight.findAll({ where: landFreightInfo });
    } else {
      landFreight = await LandFreight.findAll();
    }

    if (landFreight.length > 0) return landFreight;
    else throw new NotFoundException('Land freight not found');
  }

  async create(landFreightInfo: CreateLandFreightDto): Promise<LandFreight> {
    return await this.createLandFreightStrategy.create(landFreightInfo);
  }

  async update(
    landFreightId: string,
    updateInfo: UpdateLandFreightDto,
  ): Promise<LandFreight> {
    const updatedResponse = await this.updateLandFreightStrategy.update(
      landFreightId,
      updateInfo,
    );
    return updatedResponse;
  }
}
