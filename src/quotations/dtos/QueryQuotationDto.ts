import { z } from 'zod';

export const QueryQuotationSchema = z.object({
  totalPrice: z.coerce.number().min(0).optional(),
  pickupDate: z.string().date().optional(),
  deliveryDate: z.string().date().optional(),
  quotationDate: z.string().date().optional(),
  expiredDate: z.string().date().optional(),
});

// Xuất kiểu dữ liệu tương ứng
export type QueryQuotationDto = z.infer<typeof QueryQuotationSchema>;
