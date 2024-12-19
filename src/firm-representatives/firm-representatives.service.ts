import {
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { CreateFirmRepsStrategy } from './strategies/create-firm-representatives/create-firm-representatives.strategy';
import { CreateFirmRepDto } from './dtos/create-firm-representatives.dto';
import { FirmRep } from './models/firm-representatives.model';
import { UpdateFirmRepsStrategy } from './strategies/update-firm-representatives/update-firm-representatives.strategy';
import { QueryFirmRepDto } from './dtos/query-firm-representatives.dto';
import { PaginationDto } from '@/shared/dto/pagination.dto';
import { PaginatedResponse } from '@/shared/dto/paginated-response.dto';
import { InjectModel } from '@nestjs/sequelize';
import { PaginationResponse } from '@/shared/dto/paginantion-response.dto';

@Injectable()
export class FirmRepsService {
  constructor(
    @InjectModel(FirmRep)
    private firmRepModel: typeof FirmRep,
    private createFirmRepStrategy: CreateFirmRepsStrategy,
    private updateFirmRepsStrategy: UpdateFirmRepsStrategy,
  ) {}

  async createFirmReps(firmRepData: CreateFirmRepDto): Promise<FirmRep> {
    return await this.createFirmRepStrategy.create(firmRepData);
  }

  async updateFirmReps(firmRepId: string, updateData: CreateFirmRepDto) {
    return await this.updateFirmRepsStrategy.update(firmRepId, updateData);
  }

  async findFirmReps(query: QueryFirmRepDto, pagination: Partial<PaginationDto>): Promise<PaginatedResponse<FirmRep>> {
    const { page, limit} = pagination;
    const offset = (page - 1) * limit;

    let firmRep: { count: number; rows: FirmRep[] };
    if (page && limit) {
      firmRep = await this.firmRepModel.findAndCountAll({
        where: query,
        offset: offset,
        limit: limit,
      });
    } else {
      firmRep = await this.firmRepModel.findAndCountAll({
        where: query,
      });
    }

    if (firmRep.count === 0)
      throw new NotFoundException("Firm representatives not found");

    const paginationInfo: PaginationResponse = {
      currentPage: page && limit ? page : null,
      records: firmRep.count,
      totalPages: page && limit ? Math.ceil(firmRep.count / limit) : null,
      nextPage: page * limit < firmRep.count ? page + 1 : null,
      prevPage: (page - 1) * limit > 0 ? page - 1 : null,
    };

    const response: PaginatedResponse<FirmRep> = {
      pagination: paginationInfo,
      results: firmRep.rows,
    };
    return response;
  }
}
