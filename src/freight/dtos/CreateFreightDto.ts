import { z } from 'zod';
import { FreightType, WeekDay } from '@/freight/models/freight.model';

export const CreateFreightSchema = z.object({
  freightType: z.nativeEnum(FreightType),
  origin: z.string().min(1),
  destination: z.string().min(1),
  transitTime: z.number().int(),
  additionFee: z.number().optional(),
  validFrom: z.coerce.date(),
  validUntil: z.coerce.date(),
  addition_fee_breakdown: z.string().optional(),
  schedule: z.nativeEnum(WeekDay),
  providerId: z.string().uuid()
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




