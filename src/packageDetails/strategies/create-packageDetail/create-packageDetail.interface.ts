import { CreatePackageDetailDto } from '@/packageDetails/dtos/CreatePackageDetailDto';
import { PackageDetail } from '@/packageDetails/models/packageDetails.model';
import { CreateQuoteReqDetailDto } from '@/quoteReqDetails/dtos/CreateQuoteReqDetailDto';

export interface ICreatePackageDetailStrategy {
    create(packageDetailInfo: CreatePackageDetailDto): Promise<PackageDetail>;
}
