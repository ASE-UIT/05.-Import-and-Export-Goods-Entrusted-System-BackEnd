import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateShipmentTrackingDto,
  UpdateShipmentTrackingDto,
} from './dtos/create-shipment-tracking.dto';
import { ShipmentTracking } from './models/shipment-tracking.model';
import { InjectModel } from '@nestjs/sequelize';
import { QueryShipmentTrackingDto } from './dtos/query-shipment-tracking.dto';

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
        throw new NotFoundException('Shipment tracking not found');
      }
    }
  }

  async findShipmentTracking(
    query: QueryShipmentTrackingDto,
  ): Promise<ShipmentTracking[]> {
    let tracker: ShipmentTracking[];
    if (query) tracker = await ShipmentTracking.findAll({ where: query });
    else tracker = await ShipmentTracking.findAll();

    if (tracker.length > 0) return tracker;
    else throw new NotFoundException('Shipment tracking not found');
  }
}
