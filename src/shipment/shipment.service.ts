import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateShipmentDto,
  //UpdateShipmentDto,
} from './dtos/create-shipment.dto';
import { Shipment } from './models/shipment.model';
import { InjectModel } from '@nestjs/sequelize';
import { ForeignKeyConstraintError } from 'sequelize';
import { QueryShipmentDto } from './dtos/query-shipment.dto';
import { PaginationDto } from '@/shared/dto/pagination.dto';
import { PaginatedResponse } from '@/shared/dto/paginated-response.dto';
import { PaginationResponse } from '@/shared/dto/paginantion-response.dto';

@Injectable()
export class ShipmentService {
  constructor(
    @InjectModel(Shipment)
    private shipmentModel: typeof Shipment,
  ) {}
  async createShipment(body: CreateShipmentDto): Promise<Shipment> {
    try {
      const newShipment = await this.shipmentModel.create({
        shipmentType: body.shipmentType,
        contractId: body.contractId,
      });
      return newShipment;
    } catch (err) {
      if (err instanceof ForeignKeyConstraintError) {
        throw new NotFoundException('Contract id not found');
      }
    }
  }

  // async updateShipment(
  //   shipmentId: string,
  //   body: UpdateShipmentDto,
  // ): Promise<Shipment> {
  //   try {
  //     const [affectedRows, [updateData]] = await this.shipmentModel.update(
  //       { ...body },
  //       { where: { id: shipmentId }, returning: true },
  //     );
  //     return updateData.dataValues as Shipment;
  //   } catch (err) {
  //     if (err instanceof TypeError) {
  //       throw new NotFoundException('Shipment not found');
  //     }
  //   }
  // }

  async findShipment(
    query: QueryShipmentDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResponse<Shipment>> {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    const { count, rows } = await this.shipmentModel.findAndCountAll({
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

    const response: PaginatedResponse<Shipment> = {
      pagination: paginationInfo,
      results: rows,
    };
    return response;
  }

  async findShipmentById(id: string): Promise<Shipment> {
    const shipment = await this.shipmentModel.findOne({ where: { id: id } });
    if (!shipment) throw new NotFoundException('Shipment not found');
    return shipment;
  }
}
