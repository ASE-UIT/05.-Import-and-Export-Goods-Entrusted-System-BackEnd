import { Injectable } from '@nestjs/common';
import { Shipment } from '../models/shipment.model';
import { ShipmentTracking } from '@/shipment-tracking/models/shipment-tracking.model';

@Injectable()
export class FindAllShipmentStrategy {
  async find(): Promise<Shipment[]> {
    return Shipment.findAll();
  }
}
