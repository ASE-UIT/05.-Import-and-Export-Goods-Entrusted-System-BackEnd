import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ShipmentType } from '../models/shipment.model';
import { ShipmentTrackingStatus } from '@/shipment-tracking/models/shipment-tracking.model';

export const CreateShipmentSchema = z.object({
  shipmentType: z.nativeEnum(ShipmentType),
  contractId: z.string().min(1),
  location: z.string().min(1),
  status: z.nativeEnum(ShipmentTrackingStatus).optional(),
});
export class CreateShipmentDto extends createZodDto(CreateShipmentSchema) {}
export class UpdateShipmentDto extends createZodDto(
  CreateShipmentSchema.partial().omit({ location: true, status: true }),
) {}
