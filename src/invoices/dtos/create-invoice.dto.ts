import { CreateAirFreightDto } from '@/airFreight/dtos/CreateAirFreightDto';
import { InvoiceStatus } from '@/shared/enums/invoice-status.enum';
import { PartialType } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateInvoiceSchema = z.object({
  invoiceDate: z.coerce.date().describe("The invoice's invoice date"),
  paidDate: z.coerce.date().describe("The invoice's paid date"),
  status: z
    .enum([
      InvoiceStatus.PENDING,
      InvoiceStatus.PARTIALLY_PAID,
      InvoiceStatus.PAID,
      InvoiceStatus.CANCELLED,
      InvoiceStatus.OVERDUE,
      InvoiceStatus.REFUNDED,
    ])
    .describe("The invoice's status"),
  taxAmount: z.coerce.number().min(0).describe("The invoice's tax amount"),
  totalAmount: z.coerce.number().min(0).describe("The invoice's total amount"),
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

export class UpdateInvoiceDto extends createZodDto(
  CreateInvoiceSchema.partial().omit({ employeeId: true, contractId: true }),
) {}
