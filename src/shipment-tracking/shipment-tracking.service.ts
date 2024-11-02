import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateShipmentTrackingDto } from './dtos/create-shipment-tracking.dto';
import { ShipmentTracking } from './models/shipment-tracking.model';
import { FindAllShipmentTrackingStrategy } from './find-strategies/find-all.strategy';
import { FindShipmentTrackingByLocationStrategy } from './find-strategies/find-by-location.strategy';
import { FindShipmentTrackingByStatusStrategy } from './find-strategies/find-by-status.strategy';
import { FindShipmentTrackingByShipmentIdStrategy } from './find-strategies/find-by-shipment-id.strategy';
import { FindShipmentTrackingStrategies } from './find-strategies/find-shipment-tracking-strategy.enum';
import { FindShipmentStrategies } from '@/shipment/find-strategies/find-shipment-strategy.enum';
import { IFindShipmentTrackingStrategy } from './find-strategies/find-shipment-tracking-strategy.interface';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class ShipmentTrackingService {
  constructor(
    @InjectModel(ShipmentTracking)
    private shipmentTrackingModel: typeof ShipmentTracking,
    private findAllShipmentTrackingStrategy: FindAllShipmentTrackingStrategy,
    private findShipmentTrackingByLocationStrategy: FindShipmentTrackingByLocationStrategy,
    private findShipmentTrackingByStatusStrategy: FindShipmentTrackingByStatusStrategy,
    private findShipmentTrackingByShipmentIdStrategy: FindShipmentTrackingByShipmentIdStrategy,
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
    body: Partial<CreateShipmentTrackingDto>,
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

  getFindStrategy(
    strategy: FindShipmentTrackingStrategies,
  ): IFindShipmentTrackingStrategy {
    switch (strategy) {
      case FindShipmentTrackingStrategies.ALL:
        return this.findAllShipmentTrackingStrategy;
      case FindShipmentTrackingStrategies.LOCATION:
        return this.findShipmentTrackingByLocationStrategy;
      case FindShipmentTrackingStrategies.SHIPMENT_ID:
        return this.findShipmentTrackingByShipmentIdStrategy;
      case FindShipmentTrackingStrategies.STATUS:
        return this.findShipmentTrackingByStatusStrategy;
    }
  }

  async findShipmentTracking(
    strategy: FindShipmentTrackingStrategies,
    info: string,
  ): Promise<ShipmentTracking[]> {
    const findStrategy = this.getFindStrategy(strategy);
    const tracker = await findStrategy.find(info);
    return tracker;
  }
}
