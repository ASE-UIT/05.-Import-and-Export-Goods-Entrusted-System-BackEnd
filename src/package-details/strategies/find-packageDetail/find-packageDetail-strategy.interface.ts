import { PackageDetail } from '@/package-details/models/packageDetails.model';

export interface IFindPackageDetailStrategy {
    find(packageDetailInfo: string): Promise<PackageDetail[] | null>;
}
