import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ShipmentType } from '../models/quoteReqDetail.model';

export const UpdateQuoteReqDetailSchema = z
  .object({
    origin: z.string().min(1).optional(),
    destination: z.string().min(1).optional(),
    shipmentReadyDate: z.coerce.date().optional(),
    shipmentDeadline: z.coerce.date().optional(),
    cargoInsurance: z.boolean().optional(),
    shipmentType: z.nativeEnum(ShipmentType).optional(),
    quoteReqId: z.string().optional(),
  })
  .refine(
    (data) =>
      !data.shipmentReadyDate ||
      !data.shipmentDeadline ||
      data.shipmentReadyDate <= data.shipmentDeadline,
    {
      message: 'Shipment ready date must be before shipment deadline',
      path: ['shipmentReadyDate'],
    },
  );

//export type UpdateQuoteReqDetailDto = z.infer<typeof UpdateQuoteReqDetailSchema>;
export class UpdateQuoteReqDetailDto extends createZodDto(
  UpdateQuoteReqDetailSchema,
) {}
