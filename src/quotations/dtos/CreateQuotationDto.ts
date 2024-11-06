import { QuotationStatus } from '@/shared/enums/quotation-status.enum';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateQuotationSchema = z.object({
  //totalPrice: z.coerce.number().min(0),
  pickupDate: z.coerce.date(),
  deliveryDate: z.coerce.date(),
  quotationDate: z.coerce.date(),
  expiredDate: z.coerce.date(),
  status: z.enum([QuotationStatus.DRAFT, QuotationStatus.BOOKED]).optional().default(QuotationStatus.DRAFT),
  quoteReqId: z.string().min(1),
  freightId: z.string().min(1),
  employeeId: z.string().min(1),
});

//export type CreateQuotationDto = z.infer<typeof CreateQuotationSchema>;

export class CreateQuotationDto extends createZodDto(CreateQuotationSchema) { }
export class UpdateQuotationDto extends createZodDto(CreateQuotationSchema.partial()) { }
