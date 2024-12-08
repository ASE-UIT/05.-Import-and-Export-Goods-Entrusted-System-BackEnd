import { ConflictException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { Provider, ProviderStatus } from './models/providers.model';
import { CreateProviderStrategy } from './strategies/create-providers/create-providers.strategy';
import { CreateProviderDto, UpdateProviderDto } from './dtos/create-providers.dto';
import { UpdateProviderStrategy } from './strategies/update-providers/update-providers.strategy';
import { InjectModel } from '@nestjs/sequelize';
import { QueryProviderDto } from './dtos/query-providers.dto';
import { PaginationDto } from '@/shared/dto/pagination.dto';
import { PaginatedResponse } from '@/shared/dto/paginated-response.dto';
import { ContactRep } from '@/contact-representatives/models/contact-representatives.model';
import { PaginationResponse } from '@/shared/dto/paginantion-response.dto';

@Injectable()
export class ProvidersService {
  constructor(
    @InjectModel(Provider)
    private providerModel: typeof Provider,
    private createProviderStrategy: CreateProviderStrategy,
    private updateProviderStrategy: UpdateProviderStrategy,
  ) {}

  async findProvider(providerInfo: QueryProviderDto, pagination: Partial<PaginationDto>): Promise<PaginatedResponse<Provider>> {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    const count = await this.providerModel.count({
      where: providerInfo,
      include: ContactRep,
      distinct: true,
    });

    if (count === 0) 
      throw new NotFoundException("Providers not found");

    let rows: Provider[];
    if (page && limit) {
      rows = await this.providerModel.findAll({
        where: providerInfo,
        include: ContactRep,
        offset: offset,
        limit: limit,
        subQuery: true,
      });
    } else {
      rows = await this.providerModel.findAll({
        where: providerInfo,
        include: ContactRep,
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

    const response: PaginatedResponse<Provider> = {
      pagination: paginationInfo,
      results: rows,
    };
    return response;
  }

  async createProvider(providerInfo: CreateProviderDto): Promise<Provider> {
    return await this.createProviderStrategy.create(providerInfo);
  }

  async updateProvider(providerId: string, updateInfo: UpdateProviderDto): Promise<Provider> {
    const updateResponse = await this.updateProviderStrategy.update(providerId, updateInfo);
    return updateResponse;
  }
}

