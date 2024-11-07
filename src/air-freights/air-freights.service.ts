import { Injectable, BadRequestException, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { AirFreight } from './models/air-freights.model';
import { CreateAirFreightStrategy } from './strategies/create-air-freights/create-air-freights.strategy';
import { CreateAirFreightDto, UpdateAirFreightDto } from './dtos/create-air-freights.dto';
import { UpdateAirFreightStrategy } from './strategies/update-air-freights/update-air-freights.strategy';
import { FindAirFreightStrategy } from './strategies/find-air-freights/find-air-freights-strategy.enum';
import { IFindAirFreightStrategy } from './strategies/find-air-freights/find-air-freights-strategy.interface';
import { QueryAirFreightDto } from './dtos/query-air-freight.dto';

@Injectable()
export class AirFreightService {
  constructor(
    private createAirFreightStrategy: CreateAirFreightStrategy,
    private updateAirFreightStrategy: UpdateAirFreightStrategy,
  ) {}

  async find(airFreightInfo: QueryAirFreightDto,
  ): Promise<AirFreight[]> {
    let airFreight: AirFreight[];
    if (airFreightInfo) {
      airFreight = await AirFreight.findAll({ where: airFreightInfo });
    } else {
      airFreight = await AirFreight.findAll();
    }

    if (airFreight.length > 0) return airFreight;
    else throw new NotFoundException('AirFreight not found');
  }

  async create(airFreightInfo: CreateAirFreightDto): Promise<AirFreight> {
    return await this.createAirFreightStrategy.create(airFreightInfo);
  }

  async update(
    airFreightId: string,
    updateInfo: UpdateAirFreightDto,
  ): Promise<AirFreight> {
    const updatedResponse = await this.updateAirFreightStrategy.update(
      airFreightId,
      updateInfo,
    );
    return updatedResponse;
  }
}
