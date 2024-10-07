import { z } from 'zod';
import { QuotationReqStatus } from '../models/quotationReq.model';

export const CreateQuotationReqSchema = z.object({
    requestDate: z.coerce.date(),
    status: z.nativeEnum(QuotationReqStatus).default(QuotationReqStatus.PENDING),
    customerId: z.string(),
});

export type CreateQuotationReqDto = z.infer<typeof CreateQuotationReqSchema>;
