import {
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { CreateContactRepsStrategy } from './strategies/create-contact-representatives/create-contact-representatives.strategy';
import { CreateContactRepDto } from './dtos/create-contact-representatives.dto';
import { ContactRep } from './models/contact-representatives.model';
import { UpdateContactRepsStrategy } from './strategies/update-contact-representatives/update-contact-representatives.strategy';
import { QueryContactRepDto } from './dtos/query-contact-representatives.dto';
import { PaginationDto } from '@/shared/dto/pagination.dto';
import { PaginatedResponse } from '@/shared/dto/paginated-response.dto';
import { InjectModel } from '@nestjs/sequelize';
import { PaginationResponse } from '@/shared/dto/paginantion-response.dto';

@Injectable()
export class ContactRepsService {
  constructor(
    @InjectModel(ContactRep)
    private contactRepModel: typeof ContactRep,
    private createContactRepStrategy: CreateContactRepsStrategy,
    private updateContactRepsStrategy: UpdateContactRepsStrategy,
  ) {}

  async createContactReps(contactRepData: CreateContactRepDto): Promise<ContactRep> {
    return await this.createContactRepStrategy.create(contactRepData);
  }

  async updateContactReps(contactRepId: string, updateData: CreateContactRepDto) {
    return await this.updateContactRepsStrategy.update(contactRepId, updateData);
  }

  async findContactReps(query: QueryContactRepDto, pagination: Partial<PaginationDto>): Promise<PaginatedResponse<ContactRep>> {
    const { page, limit} = pagination;
    const offset = (page - 1) * limit;

    let contactRep: { count: number; rows: ContactRep[] };
    if (page && limit) {
      contactRep = await this.contactRepModel.findAndCountAll({
        where: query,
        offset: offset,
        limit: limit,
      });
    } else {
      contactRep = await this.contactRepModel.findAndCountAll({
        where: query,
      });
    }

    if (contactRep.count === 0)
      throw new NotFoundException("Contact representatives not found");

    const paginationInfo: PaginationResponse = {
      currentPage: page && limit ? page : null,
      records: contactRep.count,
      totalPages: page && limit ? Math.ceil(contactRep.count / limit) : null,
      nextPage: page * limit < contactRep.count ? page + 1 : null,
      prevPage: (page - 1) * limit > 0 ? page - 1 : null,
    };

    const response: PaginatedResponse<ContactRep> = {
      pagination: paginationInfo,
      results: contactRep.rows,
    };
    return response;
  }
}
