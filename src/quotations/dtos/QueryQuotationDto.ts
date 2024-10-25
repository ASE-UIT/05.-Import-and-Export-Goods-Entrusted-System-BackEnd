import { QuotationStatus } from '@/shared/enums/quotation-status.enum';
import { z } from 'zod';

export const QueryQuotationSchema = z.object({
  totalPrice: z.coerce.number().optional(),
  pickupDate: z.coerce.date().optional(),
  deliveryDate: z.coerce.date().optional(),
  quotationDate: z.coerce.date().optional(),
  expiredDate: z.coerce.date().optional(),
  status: z.enum([QuotationStatus.DRAFT, QuotationStatus.BOOKED]).optional(),
  employeeId: z.string().optional()
});

export type QueryQuotationDto = z.infer<typeof QueryQuotationSchema>;
