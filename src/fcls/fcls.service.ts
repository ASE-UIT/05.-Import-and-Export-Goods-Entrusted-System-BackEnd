import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
  NotAcceptableException,
} from '@nestjs/common';
import { CreateFclDto, UpdateFclDto } from './dtos/create-fcls.dto';
import { FCL } from './models/fcls.model';
import { CreateFclStrategy } from './strategies/create-fcls/create-fcls.strategy';
import { UpdateFclStrategy } from './strategies/update-fcls/update-fcls.strategy';
import { QueryFclDto } from './dtos/query-fcls.dto';
import { InjectModel } from '@nestjs/sequelize';
import { PaginationResponse } from '@/shared/dto/paginantion-response.dto';
import { PaginatedResponse } from '@/shared/dto/paginated-response.dto';
import { PaginationDto } from '@/shared/dto/pagination.dto';

@Injectable()
export class FCLService {
  constructor(
    @InjectModel(FCL)
    private fclModel: typeof FCL,
    private createFclStrategy: CreateFclStrategy,
    private updateFclStrategy: UpdateFclStrategy,
  ) {}

  async find(
    fclInfo: QueryFclDto,
    pagination: Partial<PaginationDto>,
  ): Promise<PaginatedResponse<FCL>> {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    const count = await this.fclModel.count({
      where: fclInfo,
      distinct: true,
    });

    if (count === 0) {
      throw new NotFoundException('FCL not found');
    }

    let rows: FCL[];
    if (page && limit) {
      rows = await this.fclModel.findAll({
        where: fclInfo,
        offset: offset,
        limit: limit,
        subQuery: true,
      });
    } else {
      rows = await this.fclModel.findAll({
        where: fclInfo,
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

    const response: PaginatedResponse<FCL> = {
      pagination: paginationInfo,
      results: rows,
    };

    return response;
  }


  async create(fclInfo: CreateFclDto): Promise<FCL> {
    return await this.createFclStrategy.create(fclInfo);
  }

  async update(
    fcl_Id: string,
    updateInfo: UpdateFclDto,
  ): Promise<FCL> {
    const updatedResponse = await this.updateFclStrategy.update(
      fcl_Id,
      updateInfo,
    );
    return updatedResponse;
  }
}