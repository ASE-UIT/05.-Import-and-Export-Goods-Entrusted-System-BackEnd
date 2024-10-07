import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PackageDetail } from '@/packageDetails/models/packageDetails.model';
import { UpdatePackageDetailDto } from '@/packageDetails/dtos/UpdatePackageDetailDto';

@Injectable()
export class UpdatePackageDetailStrategy {
    constructor(
        @InjectModel(PackageDetail)
        private packageDetailModel: typeof PackageDetail,
    ) { }

    async update(id: string, packageDetailInfo: UpdatePackageDetailDto): Promise<void> {
        const packageDetail = await this.packageDetailModel.findByPk(id)

        if (!packageDetail) {
            throw new NotFoundException(`Package detail with id ${id} not found`)
        }

        await packageDetail.update(packageDetailInfo)
    }
}
