import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateQuotationSchema = z
  .object({
    pickupDate: z.coerce.date(),
    deliveryDate: z.coerce.date(),
    quotationDate: z.coerce.date(),
    expiredDate: z.coerce.date(),
    //userId: z.string().min(1),
    quoteReqId: z.string().min(1),
    freightId: z.string().min(1),
    employeeId: z.string().min(1).optional(),
    serviceIds: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      return (
        data.quotationDate <= data.pickupDate &&
        data.pickupDate <= data.deliveryDate &&
        data.deliveryDate <= data.expiredDate
      );
    },
    {
      message:
        'Dates must be in the following order: quotationDate <= pickupDate <= deliveryDate <= expiredDate.',
      path: ['quotationDate', 'pickupDate', 'deliveryDate', 'expiredDate'],
    },
  );

export class CreateQuotationDto extends createZodDto(CreateQuotationSchema) {}
//export class UpdateQuotationDto extends createZodDto(CreateQuotationSchema.partial()) { }
