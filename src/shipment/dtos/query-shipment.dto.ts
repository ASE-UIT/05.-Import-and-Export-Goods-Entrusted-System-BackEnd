import { z } from 'zod';
import { ShipmentType } from '../models/shipment.model';

export const QueryShipmentSchema = z.object({
  shipmentType: z.nativeEnum(ShipmentType),
  contractId: z.string().min(1),
});

export type QueryShipmentDto = z.infer<typeof QueryShipmentSchema>;
