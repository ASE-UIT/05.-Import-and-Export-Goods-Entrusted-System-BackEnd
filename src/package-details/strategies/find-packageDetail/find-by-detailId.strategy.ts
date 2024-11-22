import { Injectable } from '@nestjs/common';
import { IFindPackageDetailStrategy } from './find-packageDetail-strategy.interface';
import { PackageDetail } from '@/package-details/models/packageDetails.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class FindPackageDetailByDetailIdStrategy implements IFindPackageDetailStrategy {
    constructor(@InjectModel(PackageDetail) private packageDetailModel: typeof PackageDetail) { }

    async find(detailId: string): Promise<PackageDetail[] | null> {
        return await this.packageDetailModel.findAll({ where: { detailId: detailId } });
    }
}
