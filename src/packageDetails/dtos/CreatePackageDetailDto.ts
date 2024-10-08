import { z } from 'zod'
import { PackageType } from '../models/packageDetails.model';

export const CreatePackageDetailSchema = z.object({
    packageType: z.nativeEnum(PackageType),
    weight: z.number(),
    length: z.number(),
    width: z.number(),
    height: z.number(),
    detailId: z.string()
});

export type CreatePackageDetailDto = z.infer<typeof CreatePackageDetailSchema>;
