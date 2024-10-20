import { z } from 'zod';
import { ShipmentType } from '@/freight/models/freight.model';

export const UpdateFreightSchema = z.object({
  freightType: z.nativeEnum(ShipmentType).optional(),
  origin: z.string().min(1).optional(),
  destination: z.string().min(1).optional(),
  transitTime: z.number().int().optional(),
  transit: z.string().optional(),
  validFrom: z.coerce.date().optional(),
  validUntil: z.coerce.date().optional(),
  note: z.string().optional(),
  freeTime: z.number().int().optional(),
}).superRefine((data, ctx) => {
  if (data.validFrom && data.validUntil && data.validFrom >= data.validUntil) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "validFrom must be earlier than validUntil",
      path: ['validFrom'],
    });
  }
});

export type UpdateFreightDto = z.infer<typeof UpdateFreightSchema>;
