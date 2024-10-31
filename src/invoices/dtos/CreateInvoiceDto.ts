import { InvoiceStatus } from '@/shared/enums/invoice-status.enum';
import { z } from 'zod';

export const CreateInvoiceSchema = z.object({
  invoiceDate: z.coerce.date(),
  paidDate: z.coerce.date(),
  status: z.enum([
    InvoiceStatus.PENDING,
    InvoiceStatus.PARTIALLY_PAID,
    InvoiceStatus.PAID,
    InvoiceStatus.CANCELLED,
    InvoiceStatus.OVERDUE,
    InvoiceStatus.REFUNDED,
  ]),
  taxAmount: z.coerce.number().min(0),
  totalAmount: z.coerce.number().min(0),
});

export type CreateInvoiceDto = z.infer<typeof CreateInvoiceSchema>;
