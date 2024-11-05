import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ICreateLandFreightStrategy } from './create-land-freights-strategy.interface';
import { CreateLandFreightDto } from '@/land-freights/dtos/create-land-freights.dto';
import { LandFreight } from '@/land-freights/models/land-freights.model';
import { Freight } from '@/freights/models/freights.model';
import { UniqueConstraintError, ForeignKeyConstraintError } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import {
  ValidationError,
  ValidationErrorDetail,
} from '@/shared/classes/validation-error.class';

@Injectable()
export class CreateLandFreightStrategy implements ICreateLandFreightStrategy {
  constructor(
    @InjectModel(LandFreight)
    private readonly landFreightModel: typeof LandFreight,
    @InjectModel(Freight)
    private readonly freightRepository: typeof Freight,
  ) {}

  async create(landFreightData: CreateLandFreightDto): Promise<LandFreight> {
    try {
      const newLandFreight = await this.landFreightModel.create({
        price_0_100: landFreightData.price_0_100,
        price_100_200: landFreightData.price_100_200,
        price_200_500: landFreightData.price_200_500,
        price_500_1500: landFreightData.price_500_1500,
        price_1500_5000: landFreightData.price_1500_5000,
        price_5000_10000: landFreightData.price_5000_10000,
        price_10000: landFreightData.price_10000,
        freight_id: landFreightData.freight_id,
      });
      return newLandFreight;
    } catch (err) {
      if (err instanceof ForeignKeyConstraintError) {
        throw new NotFoundException('Freight not found');
      }
    }
  }
}

