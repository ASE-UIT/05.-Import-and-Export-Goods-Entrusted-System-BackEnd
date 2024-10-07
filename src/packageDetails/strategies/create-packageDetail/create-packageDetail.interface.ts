import { CreatePackageDetailDto } from '@/packageDetails/dtos/CreatePackageDetailDto';
import { CreateQuoteReqDetailDto } from '@/quoteReqDetails/dtos/CreateQuoteReqDetailDto';

export interface ICreatePackageDetailStrategy {
    create(packageDetailInfo: CreatePackageDetailDto): Promise<void>;
}
