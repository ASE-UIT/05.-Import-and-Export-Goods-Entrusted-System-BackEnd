import { QuotationStatus } from '@/shared/enums/quotation-status.enum';
import { z } from 'zod';

export const CreateQuotationSchema = z.object({
  totalPrice: z.coerce.number().min(0),
  pickupDate: z.coerce.date(),
  deliveryDate: z.coerce.date(),
  quotationDate: z.coerce.date(),
  expiredDate: z.coerce.date(),
  status: z.enum([QuotationStatus.DRAFT, QuotationStatus.BOOKED]),
});

export type CreateQuotationDto = z.infer<typeof CreateQuotationSchema>;
