import { Injectable } from '@nestjs/common';
import { QuoteReqDetail } from '@/quoteReqDetails/models/quoteReqDetail.model';
import { PackageDetail } from '@/packageDetails/models/packageDetails.model';

@Injectable()
export class FindAllPackageDetailStrategy {
    async find(): Promise<PackageDetail[] | null> {
        return PackageDetail.findAll();
    }
}
