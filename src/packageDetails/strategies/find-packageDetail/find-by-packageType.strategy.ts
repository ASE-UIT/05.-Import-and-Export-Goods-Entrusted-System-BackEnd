import { Injectable } from '@nestjs/common';
import { IFindPackageDetailStrategy } from './find-packageDetail-strategy.interface';
import { PackageDetail } from '@/packageDetails/models/packageDetails.model';

@Injectable()
export class FindPackageDetailByPackageTypeStrategy implements IFindPackageDetailStrategy {
    async find(packageType: string): Promise<PackageDetail[] | null> {
        return PackageDetail.findAll({ where: { packageType: packageType } });
    }
}
