import { InvoiceStatus } from '@/shared/enums/invoice-status.enum';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateInvoiceSchema = z.object({
  taxAmount: z.coerce.number().min(1).describe("The invoice's tax amount"),
  totalAmount: z.coerce.number().min(1).describe("The invoice's total amount"),
  expiredDate: z.coerce
    .date()
    .describe("The invoice's expired date")
    .refine((date) => date > new Date(), {
      message: 'The expired date must be greater than current date',
    }),
  employeeId: z
    .string({
      message: 'An employee association is needed to create an invoice',
    })
    .uuid()
    .describe('The employee ID associated with the invoice'),
  contractId: z
    .string({
      message: 'An employee association is needed to create an contract',
    })
    .uuid()
    .describe('The employee ID associated with the contract'),
});

export class CreateInvoiceDto extends createZodDto(CreateInvoiceSchema) {}
