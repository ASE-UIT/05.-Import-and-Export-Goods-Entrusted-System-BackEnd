import { z } from 'zod';
import { QuotationReqStatus } from '../models/quotationReq.model';

export const QueryQuotationSchema = z.object({
    all: z.string().optional(),
    requestDate: z.string().optional(),
    status: z.nativeEnum(QuotationReqStatus).optional(),
    customerId: z.string().optional()
});

export type QueryQuotationDto = z.infer<typeof QueryQuotationSchema>;
