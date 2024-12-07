import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
  NotAcceptableException,
} from '@nestjs/common';
import { CreateLclDto, UpdateLclDto } from './dtos/create-lcls.dto';
import { LCL } from './models/lcls.model';
import { CreateLclStrategy } from './strategies/create-lcls/create-lcls.strategy';
import { FindLclStrategy } from './strategies/find-lcls/find-lcls-strategy.enum';
import { IFindLclStrategy } from './strategies/find-lcls/find-lcls-strategy.interface';
import { UpdateLclStrategy } from './strategies/update-lcls/update-lcls.strategy';
import { QueryLclDto } from './dtos/query-lcls.dto';
import { PaginationResponse } from '@/shared/dto/paginantion-response.dto';
import { PaginatedResponse } from '@/shared/dto/paginated-response.dto';
import { PaginationDto } from '@/shared/dto/pagination.dto';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class LCLService {
  constructor(
    @InjectModel(LCL)
    private lclModel: typeof LCL,
    private createLclStrategy: CreateLclStrategy,
    private updateLclStrategy: UpdateLclStrategy,
  ) {}

  async find(
  lclInfo: QueryLclDto,
  pagination: Partial<PaginationDto>,
): Promise<PaginatedResponse<LCL>> {
  const { page, limit } = pagination;
  const offset = (page - 1) * limit;

  const count = await this.lclModel.count({
    where: lclInfo,
    distinct: true,
  });

  if (count === 0) {
    throw new NotFoundException('LCL not found');
  }

  let rows: LCL[];
  if (page && limit) {
    rows = await this.lclModel.findAll({
      where: lclInfo,
      offset: offset,
      limit: limit,
      subQuery: true,
    });
  } else {
    rows = await this.lclModel.findAll({
      where: lclInfo,
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

  const response: PaginatedResponse<LCL> = {
    pagination: paginationInfo,
    results: rows,
  };

  return response;
}


  async create(lclInfo: CreateLclDto): Promise<LCL> {
    return await this.createLclStrategy.create(lclInfo);
  }

  async update(
    lcl_Id: string,
    updateInfo: UpdateLclDto,
  ): Promise<LCL> {
    const updatedResponse = await this.updateLclStrategy.update(
      lcl_Id,
      updateInfo,
    );
    return updatedResponse;
  }
}