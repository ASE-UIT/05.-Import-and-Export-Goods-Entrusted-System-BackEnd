import { PaymentStatus } from '@/shared/enums/payment-status.enum';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const QueryPaymentSchema = z.object({
  amountPaid: z.coerce.number().optional(),
  status: z
    .enum([
      PaymentStatus.COMPLETED,
      PaymentStatus.CANCELLED,
      PaymentStatus.PENDING,
      PaymentStatus.REFUNDED,
    ])
    .optional(),
  invoiceId: z.string().uuid().optional(),
  createdAt: z.coerce.date().optional(),
});

export type QueryPaymentDto = z.infer<typeof QueryPaymentSchema>;
