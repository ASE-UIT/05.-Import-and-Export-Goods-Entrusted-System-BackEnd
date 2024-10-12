import { z } from 'zod';

export const UpdateQuoteReqDetailSchema = z.object({
    origin: z.string().min(1).optional(),
    destination: z.string().min(1).optional(),
    shipmentReadyDate: z.coerce.date().optional(),
    shipmentDeadline: z.coerce.date().optional(),
    cargoInsurance: z.boolean().optional(),
    quoteReqId: z.string().optional()
});

export type UpdateQuoteReqDetailDto = z.infer<typeof UpdateQuoteReqDetailSchema>;
