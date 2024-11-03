import { Injectable } from '@nestjs/common';
import { ICreatePackageDetailStrategy } from './create-packageDetail.interface';
import { CreatePackageDetailDto } from '@/package-details/dtos/CreatePackageDetailDto';
import { PackageDetail } from '@/package-details/models/packageDetails.model';

@Injectable()
export class CreatePackageDetailStrategy implements ICreatePackageDetailStrategy {
    async create(packageDetailInfo: CreatePackageDetailDto): Promise<PackageDetail> {

        const packageDetail = new PackageDetail()
        packageDetail.detailId = packageDetailInfo.detailId
        packageDetail.packageType = packageDetailInfo.packageType
        packageDetail.weight = packageDetailInfo.weight
        packageDetail.length = packageDetailInfo.length
        packageDetail.width = packageDetailInfo.width
        packageDetail.height = packageDetailInfo.height
        await packageDetail.save()
        return packageDetail
    }
}
