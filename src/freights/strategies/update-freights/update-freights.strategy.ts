import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { IUpdateFreightStrategy } from './update-freights-strategy.interface';
import { Freight } from '@/freights/models/freights.model';
import { UpdateFreightDto } from '@/freights/dtos/update-freights.dto';
import { ForeignKeyConstraintError, Op, UniqueConstraintError } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import {
  ValidationError,
  ValidationErrorDetail,
} from '@/shared/classes/validation-error.class';
import { Provider, ProviderStatus } from '@/providers/models/providers.model';

@Injectable()
export class UpdateFreightStrategy implements IUpdateFreightStrategy {
  constructor(
    @InjectModel(Freight)
    private freightModel: typeof Freight,
    @InjectModel(Provider)
    private providerModel: typeof Provider,
  ) {}

  async update(
    freightId: string,
    updateInfo: UpdateFreightDto,
  ): Promise<Freight> {
    const freight = await this.freightModel.findByPk(freightId);
    if (!freight) {
      throw new NotFoundException('Freight not found');
    }
    try {
      const [affectedRows, [updatedData]] = await this.freightModel.update(
        { ...updateInfo },
        { where: { id: freightId }, returning: true },
      );

      if (affectedRows === 0) {
        throw new NotFoundException('Freight not found');
      }

      if (updateInfo.providerId) {
        await this.updateProviderStatus(updateInfo.providerId);
      }

      return updatedData.dataValues as Freight;
    } catch (err) {
      if (err instanceof ForeignKeyConstraintError) {
        throw new ConflictException('Provider not found');
      }
    }
  }

   private async updateProviderStatus(providerId: string): Promise<void> {
    const provider = await this.providerModel.findByPk(providerId);
    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    const freightCount = await this.freightModel.count({
      where: {
        providerId,
        freightType: { [Op.in]: ['AIR', 'FCL', 'LCL', 'LAND'] },
      },
      distinct: true,
      col: 'freightType',
    });

    provider.status = freightCount >= 4 ? ProviderStatus.ACTIVE : ProviderStatus.INACTIVE;
    await provider.save();
  }
}

