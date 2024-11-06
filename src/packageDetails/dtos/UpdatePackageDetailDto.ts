import { z } from 'zod';
import { PackageType } from '../models/packageDetails.model';

export const UpdatePackageDetailSchema = z.object({
    packageType: z.nativeEnum(PackageType).optional(),
    weight: z.number().optional(),
    length: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    detailId: z.string().optional()
});

export type UpdatePackageDetailDto = z.infer<typeof UpdatePackageDetailSchema>;
