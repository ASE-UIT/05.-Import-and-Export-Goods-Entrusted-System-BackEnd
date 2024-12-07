import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { ForeignKeyConstraintError } from 'sequelize';
import { QueryPackageDetailDto } from './dtos/QueryPackageDetailDto';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class PackageDetailsService {
  constructor(
    @InjectModel(PackageDetail)
    private packageDetailModel: typeof PackageDetail,
    private createPackageDetailStrategy: CreatePackageDetailStrategy,
    private updatePackageDetailStrategy: UpdatePackageDetailStrategy,
    private findAllPackageDetailStrategy: FindAllPackageDetailStrategy,
    private findPackageDetailByDetailIdStrategy: FindPackageDetailByDetailIdStrategy,
    private findPackageDetailByPackageTypeStrategy: FindPackageDetailByPackageTypeStrategy,
  ) {}

  async findPackageDetail(
    packageDetailInfo: QueryPackageDetailDto,
  ): Promise<PackageDetail[]> {
    const rows = await this.packageDetailModel.findAll({
      where: packageDetailInfo,
      subQuery: true,
    });

    return rows;
  }

  async findPackageDetailById(id: string): Promise<PackageDetail> {
    const packageDetail = await this.packageDetailModel.findByPk(id);
    if (!packageDetail) {
      throw new NotFoundException(
        'Package detail id does not exists in database',
      );
    }
    return;
  }

  getFindStrategy(
    strategy: FindPackageDetailStrategy,
  ): IFindPackageDetailStrategy {
    switch (strategy) {
      case FindPackageDetailStrategy.ALL:
        return this.findAllPackageDetailStrategy;
      case FindPackageDetailStrategy.DETAILID:
        return this.findPackageDetailByDetailIdStrategy;
      case FindPackageDetailStrategy.PACKAGETYPE:
        return this.findPackageDetailByPackageTypeStrategy;
    }
  }

  async createPackageDetail(
    packageDetailInfo: CreatePackageDetailDto,
  ): Promise<PackageDetail> {
    try {
      return await this.createPackageDetailStrategy.create(packageDetailInfo);
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        throw new HttpException('Invalid foreign key.', HttpStatus.BAD_REQUEST);
      }
      throw new Error('Error when create quote request detail');
    }
  }

  async updatePackageDetail(
    id: string,
    packageDetailInfo: Partial<CreatePackageDetailDto>,
  ): Promise<PackageDetail> {
    try {
      return await this.updatePackageDetailStrategy.update(
        id,
        packageDetailInfo,
      );
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        throw new HttpException('Invalid foreign key.', HttpStatus.BAD_REQUEST);
      }
      if (error instanceof NotFoundException) {
        throw new HttpException(
          'Quote request detail id does not exists in database',
          HttpStatus.NOT_FOUND,
        );
      }
      throw new Error();
    }
  }
}
