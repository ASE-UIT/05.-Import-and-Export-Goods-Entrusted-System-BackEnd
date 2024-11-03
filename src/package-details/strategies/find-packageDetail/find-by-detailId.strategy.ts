import { Injectable } from '@nestjs/common';
import { IFindPackageDetailStrategy } from './find-packageDetail-strategy.interface';
import { PackageDetail } from '@/package-details/models/packageDetails.model';

@Injectable()
export class FindPackageDetailByDetailIdStrategy implements IFindPackageDetailStrategy {
    async find(detailId: string): Promise<PackageDetail[] | null> {
        return PackageDetail.findAll({ where: { detailId: detailId } });
    }
}
