import { InvoiceStatus } from '@/shared/enums/invoice-status.enum';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UpdateInvoiceSchema = z.object({
  status: z
    .enum([InvoiceStatus.CANCELLED, InvoiceStatus.REFUNDED])
    .describe("The invoice's status"),
});

export class UpdateInvoiceDto extends createZodDto(
  UpdateInvoiceSchema.partial(),
) {}
