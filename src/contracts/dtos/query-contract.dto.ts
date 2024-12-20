import { ContractStatus } from '@/shared/enums/contract-status.enum';
import { z, ZodBoolean } from 'zod';

export const QueryContractSchema = z.object({
  id: z.string().uuid().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  status: z
    .enum([
      ContractStatus.ACTIVE,
      ContractStatus.EXPIRED,
      ContractStatus.PENDING,
      ContractStatus.TERMINATED,
    ])
    .optional(),
  contractDate: z.coerce.date().optional(),
  employeeId: z.string().uuid().optional(),
  quotationId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
});

export type QueryContractDto = z.infer<typeof QueryContractSchema>;
