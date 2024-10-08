import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PackageDetail } from './models/packageDetails.model';
import { PackageDetailsController } from './packageDetails.controller';
import { PackageDetailsService } from './packageDetails.service';
import { CreatePackageDetailStrategy } from './strategies/create-packageDetail/create-packageDetail.strategy';
import { UpdatePackageDetailStrategy } from './strategies/update-packageDetail/update-packageDetail.strategy';
import { FindAllPackageDetailStrategy } from './strategies/find-packageDetail/find-all.strategy';
import { FindPackageDetailByDetailIdStrategy } from './strategies/find-packageDetail/find-by-detailId.strategy';
import { FindPackageDetailByPackageTypeStrategy } from './strategies/find-packageDetail/find-by-packageType.strategy';

@Module({
    imports: [SequelizeModule.forFeature([PackageDetail])],
    controllers: [PackageDetailsController],
    providers: [
        PackageDetailsService,
        CreatePackageDetailStrategy,
        UpdatePackageDetailStrategy,
        FindAllPackageDetailStrategy,
        FindPackageDetailByDetailIdStrategy,
        FindPackageDetailByPackageTypeStrategy
    ],
})
export class PackageDetailModule { }
