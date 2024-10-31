import { InvoiceStatus } from '@/shared/enums/invoice-status.enum';
import { z } from 'zod';

export const QueryInvoiceSchema = z.object({
  invoiceDate: z.coerce.date().optional(),
  paidDate: z.coerce.date().optional(),
  status: z
    .enum([
      InvoiceStatus.PENDING,
      InvoiceStatus.PARTIALLY_PAID,
      InvoiceStatus.PAID,
      InvoiceStatus.CANCELLED,
      InvoiceStatus.OVERDUE,
      InvoiceStatus.REFUNDED,
    ])
    .optional(),
  taxAmount: z.coerce.number().optional(),
  totalAmount: z.coerce.number().optional(),
});

export type QueryInvoiceDto = z.infer<typeof QueryInvoiceSchema>;
