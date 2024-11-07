import { z } from 'zod';

export const QueryQuoteReqDetailSchema = z.object({
    all: z.string().optional(),
    origin: z.string().optional(),
    destination: z.string().optional(),
    shipmentReadyDate: z.string().optional(),
    shipmentDeadline: z.string().optional(),
    cargoInsurance: z.string().optional(),
    quoteReqId: z.string().optional(),
});

export type QueryQuoteReqDetailDto = z.infer<typeof QueryQuoteReqDetailSchema>;
