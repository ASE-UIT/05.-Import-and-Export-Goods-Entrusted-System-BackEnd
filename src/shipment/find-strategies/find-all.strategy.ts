import { Injectable } from '@nestjs/common';
import { Shipment } from '../models/shipment.model';

@Injectable()
export class FindAllShipmentStrategy {
  async find(): Promise<Shipment[]> {
    return Shipment.findAll();
  }
}
