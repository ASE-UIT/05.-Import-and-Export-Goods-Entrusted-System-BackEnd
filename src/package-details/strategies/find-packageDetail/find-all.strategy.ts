import { Injectable } from '@nestjs/common';
import { QuoteReqDetail } from '@/quote-request-details/models/quoteReqDetail.model';
import { PackageDetail } from '@/package-details/models/packageDetails.model';

@Injectable()
export class FindAllPackageDetailStrategy {
    async find(): Promise<PackageDetail[] | null> {
        return PackageDetail.findAll();
    }
}
