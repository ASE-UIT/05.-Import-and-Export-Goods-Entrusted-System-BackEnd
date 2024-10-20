import { z } from 'zod';
import { QuotationReqStatus } from '../models/quotationReq.model';

export const UpdateQuotationReqSchema = z.object({
    requestDate: z.coerce.date().optional(),
    status: z.nativeEnum(QuotationReqStatus).optional(),
    customerId: z.string().optional(),
});

export type UpdateQuotationReqDto = z.infer<typeof UpdateQuotationReqSchema>;
