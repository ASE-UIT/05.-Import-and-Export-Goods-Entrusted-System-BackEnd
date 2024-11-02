import { Shipment, ShipmentType } from '../models/shipment.model';

export interface IFindShipmentStrategy {
  find(shipmentInfo: string): Promise<Shipment[]>;
}
