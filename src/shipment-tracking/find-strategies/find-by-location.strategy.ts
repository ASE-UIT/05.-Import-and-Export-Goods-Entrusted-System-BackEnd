import { Injectable } from '@nestjs/common';
import { IFindShipmentTrackingStrategy } from './find-shipment-tracking-strategy.interface';
import { ShipmentTracking } from '../models/shipment-tracking.model';

@Injectable()
export class FindShipmentTrackingByLocationStrategy
  implements IFindShipmentTrackingStrategy
{
  find(trackingLocation: string): Promise<ShipmentTracking[]> {
    return ShipmentTracking.findAll({
      where: {
        location: trackingLocation,
      },
    });
  }
}
