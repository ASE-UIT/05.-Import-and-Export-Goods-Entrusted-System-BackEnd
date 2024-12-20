import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContactRepFirmRepDto } from './dtos/create-contact-firm-representatives.dto';
import { ContactRepFirmRep } from './models/contact-firm-representatives.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateContactRepFirmRepStrategy } from './strategies/create-contact-firm-representatives/create-contact-firm-representatives.strategy';
import { UpdateContactRepFirmRepStrategy } from './strategies/update-contact-firm-representatives/update-contact-firm-representatives.strategy';
import { QueryContactRepFirmRepDto } from './dtos/query-contact-firm-representatives.dto';
import { PaginationDto } from '@/shared/dto/pagination.dto';
import { PaginatedResponse } from '@/shared/dto/paginated-response.dto';
import { PaginationResponse } from '@/shared/dto/paginantion-response.dto';

@Injectable()
export class ContactRepFirmRepService {
  constructor(
    @InjectModel(ContactRepFirmRep)
    private contactRepFirmRepModel: typeof ContactRepFirmRep,
    private createContactRepFirmRepStrategy: CreateContactRepFirmRepStrategy,
    private updateContactRepFirmRepStrategy: UpdateContactRepFirmRepStrategy,
  ) {}

  async createContactRepFirmRep(contactRepFirmRepData: CreateContactRepFirmRepDto): Promise<ContactRepFirmRep> {
    return await this.createContactRepFirmRepStrategy.create(contactRepFirmRepData);
  }

  async updateContactRepFirmRep(
    id: string,
    updateData: CreateContactRepFirmRepDto
  ): Promise<ContactRepFirmRep> {
    return await this.updateContactRepFirmRepStrategy.update(id, updateData);
  }

  async findContactRepFirmRep(
    query: QueryContactRepFirmRepDto,
    pagination: Partial<PaginationDto>
  ): Promise<PaginatedResponse<ContactRepFirmRep>> {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    let contactRepFirmRep: { count: number; rows: ContactRepFirmRep[] };
    if (page && limit) {
      contactRepFirmRep = await this.contactRepFirmRepModel.findAndCountAll({
        where: query,
        offset: offset,
        limit: limit,
      });
    } else {
      contactRepFirmRep = await this.contactRepFirmRepModel.findAndCountAll({
        where: query,
      });
    }

    if (contactRepFirmRep.count === 0)
      throw new NotFoundException('Contact Representative and Firm Representative relations not found');

    const paginationInfo: PaginationResponse = {
      currentPage: page && limit ? page : null,
      records: contactRepFirmRep.count,
      totalPages: page && limit ? Math.ceil(contactRepFirmRep.count / limit) : null,
      nextPage: page * limit < contactRepFirmRep.count ? page + 1 : null,
      prevPage: (page - 1) * limit > 0 ? page - 1 : null,
    };

    const response: PaginatedResponse<ContactRepFirmRep> = {
      pagination: paginationInfo,
      results: contactRepFirmRep.rows,
    };
    return response;
  }
}

