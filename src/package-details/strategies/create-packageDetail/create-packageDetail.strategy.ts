import { Injectable } from '@nestjs/common';
import { ICreatePackageDetailStrategy } from './create-packageDetail.interface';
import { CreatePackageDetailDto } from '@/package-details/dtos/CreatePackageDetailDto';
import { PackageDetail } from '@/package-details/models/packageDetails.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class CreatePackageDetailStrategy implements ICreatePackageDetailStrategy {
    constructor(@InjectModel(PackageDetail) private packageDetailModel: typeof PackageDetail) { }

    async create(packageDetailInfo: CreatePackageDetailDto): Promise<PackageDetail> {

        // const packageDetail = new PackageDetail()
        // packageDetail.detailId = packageDetailInfo.detailId
        // packageDetail.packageType = packageDetailInfo.packageType
        // packageDetail.weight = packageDetailInfo.weight
        // packageDetail.length = packageDetailInfo.length
        // packageDetail.width = packageDetailInfo.width
        // packageDetail.height = packageDetailInfo.height

        const newPackage = await this.packageDetailModel.create({
            detailId: packageDetailInfo.detailId,
            packageType: packageDetailInfo.packageType,
            weight: packageDetailInfo.weight,
            length: packageDetailInfo.length,
            width: packageDetailInfo.width,
            height: packageDetailInfo.height
        })
        // await packageDetail.save()
        return newPackage
    }
}
