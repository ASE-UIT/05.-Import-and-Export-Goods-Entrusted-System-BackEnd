import { PaymentStatus } from '@/shared/enums/payment-status.enum';
import { PartialType } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreatePaymentSchema = z.object({
  amountPaid: z.coerce.number().min(1).describe("The payment's amount paid"),
  invoiceId: z
    .string({
      message: 'An invoice association is needed to create an payment',
    })
    .uuid()
    .describe('The invoice ID associated with the payment'),
});

export class CreatePaymentDto extends createZodDto(CreatePaymentSchema) {}
