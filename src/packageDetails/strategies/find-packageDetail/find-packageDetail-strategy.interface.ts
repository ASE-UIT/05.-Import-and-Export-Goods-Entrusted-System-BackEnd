import { PackageDetail } from '@/packageDetails/models/packageDetails.model';

export interface IFindPackageDetailStrategy {
    find(packageDetailInfo: string): Promise<PackageDetail[] | null>;
}
