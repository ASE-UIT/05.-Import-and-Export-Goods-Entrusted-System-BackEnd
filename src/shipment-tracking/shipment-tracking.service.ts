import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateShipmentTrackingDto,
  UpdateShipmentTrackingDto,
} from './dtos/create-shipment-tracking.dto';
import { ShipmentTracking } from './models/shipment-tracking.model';
import { InjectModel } from '@nestjs/sequelize';
import { QueryShipmentTrackingDto } from './dtos/query-shipment-tracking.dto';
import { PaginationDto } from '@/shared/dto/pagination.dto';
import { PaginatedResponse } from '@/shared/dto/paginated-response.dto';
import { PaginationResponse } from '@/shared/dto/paginantion-response.dto';

@Injectable()
export class ShipmentTrackingService {
  constructor(
    @InjectModel(ShipmentTracking)
    private shipmentTrackingModel: typeof ShipmentTracking,
  ) {}

  async createShipmentTracking(
    body: CreateShipmentTrackingDto,
  ): Promise<ShipmentTracking> {
    try {
      const newTracker = await this.shipmentTrackingModel.create({
        shipmentId: body.shipmentId,
        status: body.status,
        location: body.location,
      });
      return newTracker;
    } catch (err) {
      console.log(err);
    }
  }
  async updateShipmentTracking(
    shipmentTrackingId: string,
    body: UpdateShipmentTrackingDto,
  ) {
    try {
      const [affectedRows, [updateData]] =
        await this.shipmentTrackingModel.update(
          { ...body },
          { where: { id: shipmentTrackingId }, returning: true },
        );
      return updateData.dataValues as ShipmentTracking;
    } catch (err) {
      if (err instanceof TypeError) {
        throw new NotFoundException('Shipment tracking id not found');
      }
    }
  }

  async findShipmentTracking(
    query: QueryShipmentTrackingDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResponse<ShipmentTracking>> {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    const { count, rows } = await this.shipmentTrackingModel.findAndCountAll({
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

    const response: PaginatedResponse<ShipmentTracking> = {
      pagination: paginationInfo,
      results: rows,
    };
    return response;
  }

  async findShipmentTrackingById(id: string): Promise<ShipmentTracking> {
    const tracking = await this.shipmentTrackingModel.findOne({
      where: { id: id },
    });
    if (!tracking) throw new NotFoundException('Shipment tracking not found');
    return tracking;
  }
}
