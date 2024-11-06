import { Shipment } from '../models/shipment.model';
import { IFindShipmentStrategy } from './find-shipment-strategy.interface';

export class FindShipmentByContractIdStrategy implements IFindShipmentStrategy {
  async find(id: string): Promise<Shipment[]> {
    return Shipment.findAll({ where: { contractId: id } });
  }
}
