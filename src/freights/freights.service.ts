import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Freight } from './models/freights.model';
import { Provider, ProviderStatus } from '@/providers/models/providers.model';
import { CreateFreightDto } from './dtos/create-freights.dto';
import { UpdateFreightDto } from './dtos/update-freights.dto';
import { CreateFreightStrategy } from './strategies/create-freights/create-freights.strategy';
import { UpdateFreightStrategy } from './strategies/update-freights/update-freights.strategy';
import { QueryFreightDto } from './dtos/query-freights.dto';
import { PaginationResponse } from '@/shared/dto/paginantion-response.dto';
import { PaginatedResponse } from '@/shared/dto/paginated-response.dto';
import { PaginationDto } from '@/shared/dto/pagination.dto';

@Injectable()
export class FreightService {
  constructor(
    @InjectModel(Freight)
    private freightModel: typeof Freight,
    private createFreightStrategy: CreateFreightStrategy,
    private updateFreightStrategy: UpdateFreightStrategy,
  ) {}

  // async find(freightInfo: QueryFreightDto): Promise<Freight[]> {
  //   const freight = await Freight.findAll({
  //     where: freightInfo || {}, 
  //     include: [
  //       {
  //         model: Provider,
  //         attributes: ['status'], 
  //       },
  //     ],
  //   });

  //   if (freight.length === 0) {
  //     throw new NotFoundException('Freight not found');
  //   }

  //   const activeFreight = freight.filter(f => f.provider?.status === 'active');
  //   const inactiveFreight = freight.filter(f => f.provider?.status === 'inactive');

  //   if (activeFreight.length === 0 && inactiveFreight.length > 0) {
  //     throw new ConflictException('Freight not available because all providers are inactive');
  //   }

  //   return activeFreight;
  // }

  async find(
    freightInfo: QueryFreightDto,
    pagination: Partial<PaginationDto>,
  ): Promise<PaginatedResponse<Freight>> {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    const count = await this.freightModel.count({
      where: freightInfo || {},
      include: [
        {
          model: Provider,
          attributes: ['status'], 
        },
      ],
      distinct: true,
    });

    if (count === 0)
      throw new NotFoundException("Freights not found");

    let rows: Freight[];
    if (page && limit) {
      rows = await this.freightModel.findAll({
        where: freightInfo || {},
        include: [
          {
            model: Provider,
            attributes: ['status'],
          },
        ],
        offset: offset,
        limit: limit,
        subQuery: true,
      });
    } else {
      rows = await this.freightModel.findAll({
        where: freightInfo || {},
        include: [
          {
            model: Provider,
            attributes: ['status'],
          },
        ],
        subQuery: true,
      });
    }
    

    if (rows.length === 0) {
      throw new NotFoundException('Freight not found');
    }

    const activeFreight = rows.filter((f) => f.provider?.status === 'active');
    const inactiveFreight = rows.filter((f) => f.provider?.status === 'inactive');

    // if (activeFreight.length === 0 && inactiveFreight.length > 0) {
    //   throw new ConflictException('Freight not available because all providers are inactive');
    // }

    const paginationInfo: PaginationResponse = {
      currentPage: page && limit ? page : null,
      records: count,
      totalPages: page && limit ? Math.ceil(count / limit) : null,
      nextPage: page * limit < count ? page + 1 : null,
      prevPage: (page - 1) * limit > 0 ? page - 1 : null,
    };

    const response: PaginatedResponse<Freight> = {
        pagination: paginationInfo,
        results: rows,
      };
    return response;
  }


  async create(freightInfo: CreateFreightDto): Promise<Freight> {
    return await this.createFreightStrategy.create(freightInfo);
  }

  async update(
    freightId: string,
    updateInfo: UpdateFreightDto,
  ): Promise<Freight> {

    const updatedFreight = await this.updateFreightStrategy.update(
      freightId,
      updateInfo,
    );

    return updatedFreight;
  }
}
