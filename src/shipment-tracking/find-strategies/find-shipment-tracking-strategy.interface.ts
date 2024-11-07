import { ShipmentTracking } from '../models/shipment-tracking.model';

export interface IFindShipmentTrackingStrategy {
  find(trackingInfo: string): Promise<ShipmentTracking[]>;
}
