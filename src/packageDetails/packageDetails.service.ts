import { Injectable } from '@nestjs/common';
import { CreatePackageDetailDto } from './dtos/CreatePackageDetailDto';
import { CreatePackageDetailStrategy } from './strategies/create-packageDetail/create-packageDetail.strategy';
import { UpdatePackageDetailDto } from './dtos/UpdatePackageDetailDto';
import { UpdatePackageDetailStrategy } from './strategies/update-packageDetail/update-packageDetail.strategy';
import { FindPackageDetailStrategy } from './strategies/find-packageDetail/find-packageDetail-strategy.enum';
import { PackageDetail } from './models/packageDetails.model';
import { IFindPackageDetailStrategy } from './strategies/find-packageDetail/find-packageDetail-strategy.interface';
import { FindAllPackageDetailStrategy } from './strategies/find-packageDetail/find-all.strategy';
import { FindPackageDetailByDetailIdStrategy } from './strategies/find-packageDetail/find-by-detailId.strategy';
import { FindPackageDetailByPackageTypeStrategy } from './strategies/find-packageDetail/find-by-packageType.strategy';

@Injectable()
export class PackageDetailsService {
    constructor(
        private createPackageDetailStrategy: CreatePackageDetailStrategy,
        private updatePackageDetailStrategy: UpdatePackageDetailStrategy,
        private findAllPackageDetailStrategy: FindAllPackageDetailStrategy,
        private findPackageDetailByDetailIdStrategy: FindPackageDetailByDetailIdStrategy,
        private findPackageDetailByPackageTypeStrategy: FindPackageDetailByPackageTypeStrategy
    ) { }

    async findPackageDetail(
        strategy: FindPackageDetailStrategy,
        packageDetailInfo: string
    ): Promise<PackageDetail[] | null> {
        const findStrategy = this.getFindStrategy(strategy)
        const packageDetail: PackageDetail[] | null = await findStrategy.find(packageDetailInfo)
        return packageDetail
    }

    getFindStrategy(strategy: FindPackageDetailStrategy): IFindPackageDetailStrategy {
        switch (strategy) {
            case FindPackageDetailStrategy.ALL:
                return this.findAllPackageDetailStrategy
            case FindPackageDetailStrategy.DETAILID:
                return this.findPackageDetailByDetailIdStrategy
            case FindPackageDetailStrategy.PACKAGETYPE:
                return this.findPackageDetailByPackageTypeStrategy
        }
    }

    async createPackageDetail(packageDetailInfo: CreatePackageDetailDto): Promise<PackageDetail> {
        try {
            return await this.createPackageDetailStrategy.create(packageDetailInfo)
        } catch (error) {
            throw new Error('Error when create quote request detail')
        }
    }

    async updatePackageDetail(
        id: string,
        packageDetailInfo: Partial<CreatePackageDetailDto>)
        : Promise<{
            message: string,
            data: PackageDetail
        }> {
        const updatedResponse = await this.updatePackageDetailStrategy.update(id, packageDetailInfo)
        return { message: 'Package detail updated successfully', data: updatedResponse }
    }

}
