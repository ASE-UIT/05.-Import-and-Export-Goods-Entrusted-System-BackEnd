import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { ICreateLandFreightStrategy } from './create-land-freight-strategy.interface';
import { CreateLandFreightDto } from '@/landFreight/dtos/CreateLandFreightDto';
import { LandFreight } from '@/landFreight/models/landFreight.model';
import { Freight } from '@/freight/models/freight.model';
import { UniqueConstraintError } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class CreateLandFreightStrategy implements ICreateLandFreightStrategy {
  constructor(
    @InjectModel(Freight)
    private readonly freightRepository: typeof Freight,
  ) {}

  async create(landFreightData: CreateLandFreightDto): Promise<LandFreight> {
    const freight = await this.freightRepository.findByPk(landFreightData.freight_id);
    
    if (!freight) {
      throw new NotFoundException('Freight not found');
    }

    const landFreight = new LandFreight();
    landFreight.price_0_100 = landFreightData.price_0_100;
    landFreight.price_100_200 = landFreightData.price_100_200;
    landFreight.price_200_500 = landFreightData.price_200_500;
    landFreight.price_500_1500 = landFreightData.price_500_1500;
    landFreight.price_1500_5000 = landFreightData.price_1500_5000;
    landFreight.price_5000_10000 = landFreightData.price_5000_10000;
    landFreight.price_10000 = landFreightData.price_10000;
    landFreight.freight_id = landFreightData.freight_id;

    try {
      await landFreight.save();
      return landFreight;
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        throw new ConflictException(err.errors[0].message);
      }
      throw new ConflictException('Failed to create land freight');
    }
  }
}

