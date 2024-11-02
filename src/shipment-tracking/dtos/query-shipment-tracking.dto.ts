import { z } from 'zod';
import { ShipmentTrackingStatus } from '../models/shipment-tracking.model';

export const QueryShipmentTrackingSchema = z.object({
  status: z.nativeEnum(ShipmentTrackingStatus),
  location: z.string().min(1),
  shipmentId: z.string().uuid(),
});

export type QueryShipmentTrackingDto = z.infer<
  typeof QueryShipmentTrackingSchema
>;
