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
import { Freight } from '@/freights/models/freights.model';
import { PaginationResponse } from '@/shared/dto/paginantion-response.dto';
import { PaginatedResponse } from '@/shared/dto/paginated-response.dto';
import { PaginationDto } from '@/shared/dto/pagination.dto';
import { InjectModel } from '@nestjs/sequelize';
@Injectable()
export class LandFreightService {
  constructor(
    @InjectModel(LandFreight)
    private landFreightModel: typeof LandFreight,
    private createLandFreightStrategy: CreateLandFreightStrategy,
    private updateLandFreightStrategy: UpdateLandFreightStrategy,
  ) {}

  async find(
    landFreightInfo: QueryLandFreightDto,
    pagination: Partial<PaginationDto>,
  ): Promise<PaginatedResponse<LandFreight>> {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    const count = await this.landFreightModel.count({
      where: landFreightInfo,
      include: Freight,
      distinct: true,
    });

    if (count === 0) {
      throw new NotFoundException('Land freight not found');
    }

    let rows: LandFreight[];
    if (page && limit) {
      rows = await this.landFreightModel.findAll({
        where: landFreightInfo,
        include: Freight,
        offset: offset,
        limit: limit,
        subQuery: true,
      });
    } else {
      rows = await this.landFreightModel.findAll({
        where: landFreightInfo,
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

    const response: PaginatedResponse<LandFreight> = {
      pagination: paginationInfo,
      results: rows,
    };

    return response;
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
