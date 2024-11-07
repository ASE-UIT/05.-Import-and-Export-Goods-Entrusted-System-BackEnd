import { Injectable } from '@nestjs/common';
import { QuoteReqDetail } from '@/quote-request-details/models/quoteReqDetail.model';
import { PackageDetail } from '@/package-details/models/packageDetails.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class FindAllPackageDetailStrategy {
    constructor(@InjectModel(PackageDetail) private packageDetailModel: typeof PackageDetail) { }

    async find(): Promise<PackageDetail[] | null> {
        return this.packageDetailModel.findAll();
    }
}
