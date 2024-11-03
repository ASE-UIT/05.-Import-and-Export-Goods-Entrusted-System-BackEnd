import { CreatePackageDetailDto } from '@/package-details/dtos/CreatePackageDetailDto';
import { PackageDetail } from '@/package-details/models/packageDetails.model';
import { CreateQuoteReqDetailDto } from '@/quote-request-details/dtos/CreateQuoteReqDetailDto';

export interface ICreatePackageDetailStrategy {
    create(packageDetailInfo: CreatePackageDetailDto): Promise<PackageDetail>;
}
