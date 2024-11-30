import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { PackageType } from '@/package-details/models/packageDetails.model';
import { ShipmentType } from '@/quote-request-details/models/quoteReqDetail.model';

export const CreateQuoteReqWithDetailSchema = z.object({
    requestDate: z.coerce.date().describe("The request date of the quote request"),
    customerId: z.string().describe("The customer ID whose create the quote request"),
    origin: z.string().min(1, "Origin is required").describe("The origin of the shipment"),
    destination: z.string().min(1, "Destination is required").describe("The destination of the shipment"),
    shipmentReadyDate: z.coerce.date().describe("The ready date for the shipment"),
    shipmentDeadline: z.coerce.date().describe("The deadline for the shipment"),
    cargoInsurance: z.boolean().describe("Whether the shipment has insurance"),
    shipmentType: z.nativeEnum(ShipmentType).describe("The type of shipment"),
    packageType: z.nativeEnum(PackageType).describe("The type of package being shipped"),
    weight: z.number().gt(0, "Weight must be greater than 0"),
    length: z.number().gt(0, "Length must be greater than 0"),
    width: z.number().gt(0, "Width must be greater than 0"),
    height: z.number().gt(0, "Height must be greater than 0"),
}).refine(data => data.shipmentReadyDate <= data.shipmentDeadline &&
    data.requestDate <= data.shipmentReadyDate, {
    message: 'Data must be in the following order: requestDate <= shipmentReadyDate <= shipmentDeadline',
    path: ['requestDate', 'shipmentReadyDate', 'shipmentDeadline']
})


export class CreateQuoteReqWithDetailDto extends createZodDto(CreateQuoteReqWithDetailSchema) { }