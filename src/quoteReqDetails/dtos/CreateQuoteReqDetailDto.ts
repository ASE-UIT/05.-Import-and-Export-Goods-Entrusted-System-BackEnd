import { z } from 'zod'

export const CreateQuoteReqDetailSchema = z.object({
    origin: z.string().min(1),
    destination: z.string().min(1),
    shipmentReadyDate: z.coerce.date(),
    shipmentDeadline: z.coerce.date(),
    cargoInsurance: z.boolean(),
    quoteReqId: z.string()
});

export type CreateQuoteReqDetailDto = z.infer<typeof CreateQuoteReqDetailSchema>;
