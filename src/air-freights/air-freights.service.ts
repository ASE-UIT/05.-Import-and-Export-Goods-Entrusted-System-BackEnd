import { Injectable, BadRequestException, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { AirFreight } from './models/air-freights.model';
import { CreateAirFreightStrategy } from './strategies/create-air-freights/create-air-freights.strategy';
import { CreateAirFreightDto, UpdateAirFreightDto } from './dtos/create-air-freights.dto';
import { UpdateAirFreightStrategy } from './strategies/update-air-freights/update-air-freights.strategy';
import { FindAirFreightStrategy } from './strategies/find-air-freights/find-air-freights-strategy.enum';
import { IFindAirFreightStrategy } from './strategies/find-air-freights/find-air-freights-strategy.interface';
import { QueryAirFreightDto } from './dtos/query-air-freight.dto';
import { InjectModel } from '@nestjs/sequelize';
import { PaginationResponse } from '@/shared/dto/paginantion-response.dto';
import { PaginatedResponse } from '@/shared/dto/paginated-response.dto';
import { PaginationDto } from '@/shared/dto/pagination.dto';
import { Freight } from '@/freights/models/freights.model';

@Injectable()
export class AirFreightService {
  constructor(
    @InjectModel(AirFreight)
    private airFreightModel: typeof AirFreight,
    private createAirFreightStrategy: CreateAirFreightStrategy,
    private updateAirFreightStrategy: UpdateAirFreightStrategy,
  ) {}

  async find(
    airFreightInfo: QueryAirFreightDto,
    pagination: Partial<PaginationDto>,
  ): Promise<PaginatedResponse<AirFreight>> {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    const count = await this.airFreightModel.count({
      where: airFreightInfo,
      include: Freight,
      distinct: true,
    });

    if (count === 0) {
      throw new NotFoundException('Air freight not found');
    }

    let rows: AirFreight[];
    if (page && limit) {
      rows = await this.airFreightModel.findAll({
        where: airFreightInfo,
        include: Freight,
        offset: offset,
        limit: limit,
        subQuery: true, 
      });
    } else {
      rows = await this.airFreightModel.findAll({
        where: airFreightInfo,
        include: Freight,
        subQuery: true,
      });
    }

    const paginationInfo: PaginationResponse = {
      currentPage: page && limit ? page : null,
      records: count,
      totalPages: page && limit ? Math.ceil(count / limit) : null,
      nextPage: page * limit < count ? page + 1 : null,
      prevPage: (page - 1) * limit > 0 ? page - 1 : null,
    };

    const response: PaginatedResponse<AirFreight> = {
      pagination: paginationInfo,
      results: rows,
    };

    return response;
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
