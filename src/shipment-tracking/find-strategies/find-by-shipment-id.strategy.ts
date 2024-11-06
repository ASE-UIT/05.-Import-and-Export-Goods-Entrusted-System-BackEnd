import { Injectable } from '@nestjs/common';
import { IFindShipmentTrackingStrategy } from './find-shipment-tracking-strategy.interface';
import { ShipmentTracking } from '../models/shipment-tracking.model';

@Injectable()
export class FindShipmentTrackingByShipmentIdStrategy
  implements IFindShipmentTrackingStrategy
{
  find(trackingShipmentId: string): Promise<ShipmentTracking[]> {
    return ShipmentTracking.findAll({
      where: { shipmentId: trackingShipmentId },
    });
  }
}
