import { z } from 'zod';
import { QuotationReqStatus } from '../models/quotationReq.model';

export const QueryQuotationReqSchema = z.object({
    all: z.string().optional(),
    requestDate: z.string().optional(),
    status: z.nativeEnum(QuotationReqStatus).optional(),
    customerId: z.string().optional()
});

export type QueryQuotationReqDto = z.infer<typeof QueryQuotationReqSchema>;
