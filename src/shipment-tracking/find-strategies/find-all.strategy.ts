import { Injectable } from '@nestjs/common';
import { IFindShipmentTrackingStrategy } from './find-shipment-tracking-strategy.interface';
import { ShipmentTracking } from '../models/shipment-tracking.model';

@Injectable()
export class FindAllShipmentTrackingStrategy {
  async find(): Promise<ShipmentTracking[]> {
    return ShipmentTracking.findAll();
  }
}
