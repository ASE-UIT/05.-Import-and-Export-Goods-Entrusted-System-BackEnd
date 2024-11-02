import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ShipmentType } from '../models/shipment.model';
import { ShipmentTrackingStatus } from '@/shipment-tracking/models/shipment-tracking.model';

export const CreateShipmentSchema = z.object({
  shipmentType: z.nativeEnum(ShipmentType).describe('Type of the shipment'),
  contractId: z
    .string()
    .min(1)
    .describe('Id of the contract from which the shipment is made'),
  location: z.string().min(1).describe('Location of the shipment'),
  status: z
    .nativeEnum(ShipmentTrackingStatus)
    .optional()
    .describe('Status of the shipment'),
});
export class CreateShipmentDto extends createZodDto(CreateShipmentSchema) {}
export class UpdateShipmentDto extends createZodDto(
  CreateShipmentSchema.partial().omit({ location: true, status: true }),
) {}
