import { z } from 'zod';
import { ShipmentType } from '@/freight/models/freight.model';

export const CreateFreightSchema = z.object({
  freightType: z.nativeEnum(ShipmentType),
  origin: z.string().min(1), 
  destination: z.string().min(1), 
  transitTime: z.number(), 
  transit: z.string(),
  validFrom: z.date(), 
  validUntil: z.date(), 
  note: z.string().optional(), 
  freeTime: z.number().optional(), 
});

export type CreateFreightDto = z.infer<typeof CreateFreightSchema>;
