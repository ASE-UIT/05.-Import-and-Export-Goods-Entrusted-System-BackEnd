import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { PackageType } from '@/package-details/models/packageDetails.model';
import { QuotationReqStatus } from '../models/quotationReq.model';
import { ShipmentType } from '@/quote-request-details/models/quoteReqDetail.model';

export const UpdateQuoteReqWithDetailSchema = z.object({
    requestDate: z.coerce.date().describe("The request date of the quote request").optional(),
    userId: z.string().describe("The customer ID whose create the quote request").optional(),
    status: z.nativeEnum(QuotationReqStatus).describe("The status of the quote request").optional(),
    origin: z.string().min(1, "Origin is required").describe("The origin of the shipment").optional(),
    destination: z.string().min(1, "Destination is required").describe("The destination of the shipment").optional(),
    shipmentReadyDate: z.coerce.date().describe("The ready date for the shipment").optional(),
    shipmentDeadline: z.coerce.date().describe("The deadline for the shipment").optional(),
    cargoInsurance: z.boolean().describe("Whether the shipment has insurance").optional(),
    shipmentType: z.nativeEnum(ShipmentType).describe("The type of shipment").optional(),
    packageType: z.nativeEnum(PackageType).describe("The type of package being shipped").optional(),
    weight: z.number().gt(0, "Weight must be greater than 0").optional(),
    length: z.number().gt(0, "Length must be greater than 0").optional(),
    width: z.number().gt(0, "Width must be greater than 0").optional(),
    height: z.number().gt(0, "Height must be greater than 0").optional(),
}).refine(
    (data) =>
        (!data.requestDate || !data.shipmentReadyDate || data.requestDate <= data.shipmentReadyDate) &&
        (!data.shipmentReadyDate || !data.shipmentDeadline || data.shipmentReadyDate <= data.shipmentDeadline),
      {
        message: 'Dates must follow the order: requestDate <= shipmentReadyDate <= shipmentDeadline',
        path: ['requestDate', 'shipmentReadyDate', 'shipmentDeadline'], // Bạn có thể chỉ định một trường cụ thể nếu muốn
      }
)

export class UpdateQuoteReqWithDetailDto extends createZodDto(UpdateQuoteReqWithDetailSchema) { }