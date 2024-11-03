import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PackageDetail } from '@/package-details/models/packageDetails.model';
import { UpdatePackageDetailDto } from '@/package-details/dtos/UpdatePackageDetailDto';
import { CreatePackageDetailDto } from '@/package-details/dtos/CreatePackageDetailDto';

@Injectable()
export class UpdatePackageDetailStrategy {
    constructor(
        @InjectModel(PackageDetail)
        private packageDetailModel: typeof PackageDetail,
    ) { }

    async update(id: string, packageDetailInfo: Partial<CreatePackageDetailDto>): Promise<PackageDetail> {
        const [affectedRows, [updateData]] = await PackageDetail.update(
            { ...packageDetailInfo },
            { where: { id: id }, returning: true },
        )
        if (affectedRows == 0) {
            throw new NotFoundException('Package detail id does not exists in database')
        }
        return updateData.dataValues as PackageDetail
    }
}
