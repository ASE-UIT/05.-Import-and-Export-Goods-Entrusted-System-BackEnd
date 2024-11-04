import { Injectable } from '@nestjs/common';
import { IFindPackageDetailStrategy } from './find-packageDetail-strategy.interface';
import { PackageDetail } from '@/package-details/models/packageDetails.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class FindPackageDetailByPackageTypeStrategy implements IFindPackageDetailStrategy {
    constructor(@InjectModel(PackageDetail) private packageDetailModel: typeof PackageDetail) { }

    async find(packageType: string): Promise<PackageDetail[] | null> {
        return this.packageDetailModel.findAll({ where: { packageType: packageType } });
    }
}
