import { z } from 'zod';
import { ShipmentType } from '@/freight/models/freight.model';

export const QueryFreightSchema = z.object({
  freightType: z.nativeEnum(ShipmentType).optional(),
  origin: z.string().min(1).optional(), 
  destination: z.string().min(1).optional(), 
  transitTime: z.number().optional(),
  transit: z.string().optional(),
  validFrom: z.date().optional(),
  validUntil: z.date().optional(),
  note: z.string().optional(),
  freeTime: z.number().optional(), 
});

export type QueryFreightDto = z.infer<typeof QueryFreightSchema>;