import { QuotationStatus } from "@/shared/enums/quotation-status.enum";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const UpdateQuotationSchema = z.object({
    //totalPrice: z.coerce.number().min(0),
    pickupDate: z.coerce.date().optional(),
    deliveryDate: z.coerce.date().optional(),
    quotationDate: z.coerce.date().optional(),
    expiredDate: z.coerce.date().optional(),
    status: z.nativeEnum(QuotationStatus).optional(),
    userId: z.string().min(1).optional(),
    quoteReqId: z.string().min(1).optional(),
    freightId: z.string().min(1).optional(),
    employeeId: z.string().min(1).optional(),
}).refine((data) => {
    // Kiểm tra thứ tự các ngày
    return data.quotationDate <= data.pickupDate &&
        data.pickupDate <= data.deliveryDate &&
        data.deliveryDate <= data.expiredDate;
}, {
    message: 'Dates must be in the following order: quotationDate <= pickupDate <= deliveryDate <= expiredDate.',
    path: ['quotationDate'],  // Chỉ báo lỗi cho trường quotationDate
})

export class UpdateQuotationDto extends createZodDto(UpdateQuotationSchema) { }
