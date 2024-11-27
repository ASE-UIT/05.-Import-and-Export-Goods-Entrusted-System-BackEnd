import { z } from 'zod';
import { FreightType } from '@/freights/models/freights.model';
import { WeekDay } from '@/shared/enums/freight-weekday.enum';

export const QueryFreightSchema = z.object({
  freightType: z.nativeEnum(FreightType).optional(),
  origin: z.string().min(1).optional(),
  destination: z.string().min(1).optional(),
  transitTime: z.coerce.number().optional(),
  validFrom: z.coerce.date().optional(),
  validUntil: z.coerce.date().optional(),
  additionFee: z.coerce.number().optional(),
  addition_fee_breakdown: z.string().optional(),
  schedule: z.nativeEnum(WeekDay).optional(),
  providerId: z.string().min(1).uuid().optional(),
  id: z.string().min(1).uuid().optional(),
});

export type QueryFreightDto = z.infer<typeof QueryFreightSchema>;