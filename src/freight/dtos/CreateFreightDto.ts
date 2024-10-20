import { z } from 'zod';
import { ShipmentType } from '@/freight/models/freight.model';

export const CreateFreightSchema = z.object({
  freightType: z.nativeEnum(ShipmentType),
  origin: z.string().min(1),
  destination: z.string().min(1),
  transitTime: z.number().int(),
  transit: z.string(),
  validFrom: z.coerce.date(),
  validUntil: z.coerce.date(),
  note: z.string().optional(),
  freeTime: z.number().int().optional(),
}).superRefine((data, ctx) => {
  if (data.validFrom >= data.validUntil) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "validFrom must be earlier than validUntil",
      path: ['validFrom'],
    });
  }
});

export type CreateFreightDto = z.infer<typeof CreateFreightSchema>;




