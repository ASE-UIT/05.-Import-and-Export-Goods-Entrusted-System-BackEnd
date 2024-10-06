import { z } from 'zod';

export const CreateQuotationSchema = z.object({
  totalPrice: z.number().min(0), // VD: 2004-05-15
  pickupDate: z.string().date(),
  deliveryDate: z.string().date(),
  quotationDate: z.string().date(),
  expiredDate: z.string().date(),
});

// Xuất kiểu dữ liệu tương ứng
export type CreateQuotationDto = z.infer<typeof CreateQuotationSchema>;
