import { z } from 'zod';
import { FreightType } from '@/freights/models/freights.model';
import { WeekDay } from '@/shared/enums/freight-weekday.enum';

export const QueryFreightSchema = z.object({
  freightType: z.nativeEnum(FreightType).optional(),
  origin: z.string().min(1).optional(),
  destination: z.string().min(1).optional(),
  transitTime: z.number().optional(),
  validFrom: z.coerce.date().optional(),
  validUntil: z.coerce.date().optional(),
  additionFee: z.number().optional(),
  additionFeeBreakdown: z.string().optional(),
  schedule: z.nativeEnum(WeekDay).optional(),
  providerId: z.string().min(1).uuid().optional(),
});

export type QueryFreightDto = z.infer<typeof QueryFreightSchema>;