import { QuotationStatus } from '@/shared/enums/quotation-status.enum';
import { z } from 'zod';

export const QueryQuotationSchema = z.object({
  pickupDate: z.string().optional(),
  deliveryDate: z.string().optional(),
  quotationDate: z.string().optional(),
  expiredDate: z.string().optional(),
  status: z.enum([QuotationStatus.DRAFT, QuotationStatus.BOOKED]).optional(),
  employeeId: z.string().optional(),
  customerId: z.string().optional(),
});

export type QueryQuotationDto = z.infer<typeof QueryQuotationSchema>;
