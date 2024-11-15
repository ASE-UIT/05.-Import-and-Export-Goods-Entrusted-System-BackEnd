import { createZodDto } from 'nestjs-zod';
import { z } from 'zod'

export const CreateQuoteReqDetailSchema = z.object({
    origin: z.string().min(1),
    destination: z.string().min(1),
    shipmentReadyDate: z.coerce.date(),
    shipmentDeadline: z.coerce.date(),
    cargoInsurance: z.boolean(),
    quoteReqId: z.string()
}).refine(data => data.shipmentReadyDate <= data.shipmentDeadline, {
    message: 'Shipment ready date must be before shipment deadline',
    path: ['shipmentReadyDate']
})

//export class CreateQuoteReqDetailDto = z.infer<typeof CreateQuoteReqDetailSchema>;
export class CreateQuoteReqDetailDto extends createZodDto(CreateQuoteReqDetailSchema) { }
//export class UpdateQuoteReqDetailDto extends createZodDto(CreateQuoteReqDetailSchema.partial()) { }
