import { z } from 'zod';
import { PackageType } from '../models/packageDetails.model';

export const QueryPackageDetailSchema = z.object({
    all: z.string().optional(),
    packageType: z.nativeEnum(PackageType).optional(),
    detailId: z.string().optional(),
});

export type QueryPackageDetailDto = z.infer<typeof QueryPackageDetailSchema>;
