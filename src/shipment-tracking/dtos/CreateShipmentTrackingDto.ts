import { z } from 'zod';
import { ShipmentTrackingStatus } from '../models/shipment-tracking.model';
import { createZodDto } from 'nestjs-zod';

export const CreateShipmentTrackingSchema = z.object({
  shipmentId: z.string().uuid().min(1),
  status: z.nativeEnum(ShipmentTrackingStatus),
  location: z.string().min(1),
});

export class CreateShipmentTrackingDto extends createZodDto(
  CreateShipmentTrackingSchema,
) {}

export class UpdateShipmentTrackingDto extends createZodDto(
  CreateShipmentTrackingSchema.partial(),
) {}
