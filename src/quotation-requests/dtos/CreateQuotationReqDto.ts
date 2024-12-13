import { z } from 'zod';
import { QuotationReqStatus } from '../models/quotationReq.model';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export const CreateQuotationReqSchema = z.object({
    requestDate: z.coerce.date().describe("The request date of the quote request"),
    //status: z.nativeEnum(QuotationReqStatus).default(QuotationReqStatus.PENDING).describe("The status of the quote request, defaul is PENDING"),
    userId: z.string().describe("The user ID whose create the quote request"),
});


export class CreateQuotationReqDto extends createZodDto(CreateQuotationReqSchema) { }

//export class UpdateQuotationReqDto extends createZodDto(CreateQuotationReqSchema.partial()) { }

//export type CreateQuotationReqDto = z.infer<typeof CreateQuotationReqSchema>;

