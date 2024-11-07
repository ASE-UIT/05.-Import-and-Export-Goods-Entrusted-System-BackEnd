import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ICreateFreightStrategy } from './create-freights-strategy.interface';
import { CreateFreightDto } from '@/freights/dtos/create-freights.dto';
import { Freight } from '@/freights/models/freights.model';
import { ForeignKeyConstraintError, Op } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { Provider, ProviderStatus } from '@/providers/models/providers.model';

@Injectable()
export class CreateFreightStrategy implements ICreateFreightStrategy {
  constructor(
    @InjectModel(Freight)
    private freightModel: typeof Freight,
    @InjectModel(Provider)
    private providerModel: typeof Provider,
  ) {}

  async create(freightData: CreateFreightDto): Promise<Freight> {
    try {
      const newFreight = await this.freightModel.create({
        freightType: freightData.freightType,
        origin: freightData.origin,
        destination: freightData.destination,
        transitTime: freightData.transitTime,
        additionFee: freightData.additionFee,
        addition_fee_breakdown: freightData.addition_fee_breakdown,
        validFrom: freightData.validFrom,
        validUntil: freightData.validUntil,
        schedule: freightData.schedule,
        providerId: freightData.providerId,
      });
      void this.updateProviderStatus(freightData.providerId);
      return newFreight;
    } catch (err) {
      if (err instanceof ForeignKeyConstraintError) {
        throw new NotFoundException('Provider not found');
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
