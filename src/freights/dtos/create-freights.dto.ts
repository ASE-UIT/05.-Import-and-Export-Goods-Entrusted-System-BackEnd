import { z } from 'zod';
import { FreightType } from '@/freights/models/freights.model';
import { PartialType } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { WeekDay } from '@/shared/enums/freight-weekday.enum';

export const CreateFreightSchema = z.object({
  freightType: z.nativeEnum(FreightType).describe("Shipment type"),
  origin: z.string().min(1).describe("Origin of the freight"),
  destination: z.string().min(1).describe("Destination of the freight"),
  transitTime: z.number().int().describe("Transit time"),
  additionFee: z.number().optional().describe("Additional fee"),
  validFrom: z.coerce.date().describe("Start date of validity"),
  validUntil: z.coerce.date().describe("End date of validity"),
  addition_fee_breakdown: z.string().optional().describe("Details of the additional fee breakdown"),
  schedule: z.nativeEnum(WeekDay).describe("Freight schedule day"),
  providerId: z.string().min(1).uuid().describe("Provider's ID"),
}).superRefine((data, ctx) => {
  if (data.validFrom >= data.validUntil) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "validFrom must be earlier than validUntil",
      path: ['validFrom'],
    });
  }
});

export class CreateFreightDto extends createZodDto(CreateFreightSchema) {}
//export class UpdateFreightDto extends PartialType(CreateFreightDto) {}
