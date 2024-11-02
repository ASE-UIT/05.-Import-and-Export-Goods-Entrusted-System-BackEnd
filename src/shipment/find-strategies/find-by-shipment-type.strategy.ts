import { Shipment } from '../models/shipment.model';
import { IFindShipmentStrategy } from './find-shipment-strategy.interface';

export class FindShipmentByShipmentTypeStrategy
  implements IFindShipmentStrategy
{
  async find(type: string): Promise<Shipment[]> {
    return Shipment.findAll({ where: { shipmentType: type } });
  }
}
