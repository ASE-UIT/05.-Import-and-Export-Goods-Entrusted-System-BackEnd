import { ContractStatus } from '@/shared/enums/contract-status.enum';
import { PartialType } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateContractSchema = z.object({
  startDate: z.coerce.date().describe("The contract's start date"),
  endDate: z.coerce.date().describe("The contract's end date"),
  status: z.enum([
    ContractStatus.ACTIVE,
    ContractStatus.EXPIRED,
    ContractStatus.PENDING,
    ContractStatus.TERMINATED,
  ]),
  contractDate: z.coerce.date().describe("The contract's contract date"),
  employeeId: z
    .string({
      message: 'An employee association is needed to create an contract',
    })
    .uuid()
    .describe('The employee ID associated with the contract'),
  quotationId: z
    .string({
      message: 'An quotation association is needed to create an contract',
    })
    .uuid()
    .describe('The quotation ID associated with the contract'),
  // userId: z
  //   .string({
  //     message: 'A user association is needed to create a contract',
  //   })
  //   .uuid()
  //   .describe('The user ID associated with the contract'),
});

export class CreateContractDto extends createZodDto(CreateContractSchema) {}

export class UpdateContractDto extends createZodDto(
  CreateContractSchema.partial().omit({ employeeId: true, quotationId: true }),
) {}
