import { QuotationStatus } from '@/shared/enums/quotation-status.enum';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UpdateQuotationSchema = z
  .object({
    //totalPrice: z.coerce.number().min(0),
    pickupDate: z.coerce.date().optional(),
    deliveryDate: z.coerce.date().optional(),
    quotationDate: z.coerce.date().optional(),
    expiredDate: z.coerce.date().optional(),
    status: z.nativeEnum(QuotationStatus).optional(),
    //userId: z.string().min(1).optional(),
    //quoteReqId: z.string().min(1).optional(),
    //freightId: z.string().min(1).optional(),
    employeeId: z.string().min(1).optional(),
  })
  .refine(
    (data) => {
      const { quotationDate, pickupDate, deliveryDate, expiredDate } = data;

      // Mảng chứa các cặp ngày cần kiểm tra theo thứ tự
      const datePairs: [Date | undefined, Date | undefined][] = [
        [quotationDate, pickupDate],
        [quotationDate, deliveryDate],
        [quotationDate, expiredDate],
        [pickupDate, deliveryDate],
        [pickupDate, expiredDate],
        [deliveryDate, expiredDate],
      ];

      // Kiểm tra từng cặp ngày
      for (const [earlierDate, laterDate] of datePairs) {
        if (earlierDate && laterDate && earlierDate > laterDate) {
          return false; // Nếu bất kỳ cặp nào không hợp lệ, trả về false
        }
      }

      return true; // Nếu tất cả các cặp hợp lệ hoặc không tồn tại
    },
    {
      message:
        'Dates must be in the following order: quotationDate <= pickupDate <= deliveryDate <= expiredDate.',
      path: ['quotationDate'], // Chỉ báo lỗi cho trường quotationDate
    },
  );

export class UpdateQuotationDto extends createZodDto(UpdateQuotationSchema) {}
