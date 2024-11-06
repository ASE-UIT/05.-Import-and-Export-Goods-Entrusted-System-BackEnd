import { Injectable } from '@nestjs/common';
import { IFindShipmentTrackingStrategy } from './find-shipment-tracking-strategy.interface';
import { ShipmentTracking } from '../models/shipment-tracking.model';

@Injectable()
export class FindShipmentTrackingByStatusStrategy
  implements IFindShipmentTrackingStrategy
{
  find(trackingStatus: string): Promise<ShipmentTracking[]> {
    return ShipmentTracking.findAll({ where: { status: trackingStatus } });
  }
}
