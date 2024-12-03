import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLegalRepsStrategy } from './strategies/create-legal-rep/create-legal-rep.strategy';
import {
  CreateLegalRepDto,
  UpdateLegalRepDto,
} from './dtos/create-legal-rep.dto';
import { LegalRep } from './models/legal-rep.model';
import { UpdateLegalRepsStrategy } from './strategies/update-legal-rep/update-legal-rep.strategy';
import { QueryLegalRepsDto } from './dtos/query-legal-rep.dto';
import { PaginationDto } from '@/shared/dto/pagination.dto';
import { PaginatedResponse } from '@/shared/dto/paginated-response.dto';
import { PaginationResponse } from '@/shared/dto/paginantion-response.dto';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class LegalRepsService {
  constructor(
    @InjectModel(LegalRep)
    private legalRepModel: typeof LegalRep,
    private createLegalRepStrategy: CreateLegalRepsStrategy,
    private updateLegalRepsStrategy: UpdateLegalRepsStrategy,
  ) {}

  //creating services
  async createLegalReps(legalRepData: CreateLegalRepDto): Promise<LegalRep> {
    return await this.createLegalRepStrategy.create(legalRepData);
  }

  //updating services
  async updateLegalReps(legalRepId: string, updateData: UpdateLegalRepDto) {
    return await this.updateLegalRepsStrategy.update(legalRepId, updateData);
  }

  async findLegalRepById(id: string): Promise<LegalRep> {
    const legalRep = await this.legalRepModel.findOne({ where: { id: id } });
    if (!legalRep)
      throw new NotFoundException('Legal representative not found');
    return legalRep;
  }

  async findLegalReps(
    query: QueryLegalRepsDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResponse<LegalRep>> {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    const { count, rows } = await this.legalRepModel.findAndCountAll({
      where: query,
      offset: offset,
      limit: limit,
    });

    const paginationInfo: PaginationResponse = {
      currentPage: page,
      records: count,
      totalPages: Math.ceil(count / limit),
      nextPage: page * limit < count ? page + 1 : null,
      prevPage: (page - 1) * limit > 0 ? page - 1 : null,
    };

    const response: PaginatedResponse<LegalRep> = {
      pagination: paginationInfo,
      results: rows,
    };
    return response;
  }
}
