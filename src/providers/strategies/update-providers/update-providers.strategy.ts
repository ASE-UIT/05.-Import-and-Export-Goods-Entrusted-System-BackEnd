import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { IUpdateProviderStrategy } from './update-providers-strategy.interface';
import { Provider, ProviderStatus } from '@/providers/models/providers.model';
import { ForeignKeyConstraintError, Op, UniqueConstraintError } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { CreateProviderDto } from '@/providers/dtos/create-providers.dto';
import {
  ValidationError,
  ValidationErrorDetail,
} from '@/shared/classes/validation-error.class';
import { Freight } from '@/freights/models/freights.model';

@Injectable()
export class UpdateProviderStrategy implements IUpdateProviderStrategy {
  constructor(
    @InjectModel(Provider)
    private providerModel: typeof Provider,
  ) {}

  async update(
    providerId: string,
    updateInfo: Partial<CreateProviderDto>,
  ): Promise<Provider> {
    const provider = await this.providerModel.findByPk(providerId);
    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    if (updateInfo.status === ProviderStatus.ACTIVE && provider.status === ProviderStatus.INACTIVE) {
      const freightCount = await this.checkFreightCount(providerId);
      if (freightCount < 4) {
        throw new ConflictException('Provider must provide at least 4 types of freight to be active');
      }
    }

    try {
      const [affectedRows, [updatedData]] = await this.providerModel.update(
        { ...updateInfo },
        { where: { id: providerId }, returning: true },
      );

      return updatedData.dataValues as Provider;
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        const errors = err.errors.map(
          (error) => new ValidationErrorDetail(error.path, error.message),
        );
        throw new ConflictException(new ValidationError(errors));
      }
      if (err instanceof ForeignKeyConstraintError) {
        throw new NotFoundException('Contact representative not found');
      }
    }
  }

  private async checkFreightCount(providerId: string): Promise<number> {
    return await Freight.count({
      where: {
        providerId,
        freightType: { [Op.in]: ['AIR', 'FCL', 'LCL', 'LAND'] },
      },
      distinct: true,
      col: 'freightType',
    });
  }
}
