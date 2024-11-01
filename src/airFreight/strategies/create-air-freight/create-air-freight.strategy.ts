import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { ICreateAirFreightStrategy } from './create-air-freight-strategy.interface';
import { CreateAirFreightDto } from '@/airFreight/dtos/CreateAirFreightDto';
import { AirFreight } from '@/airFreight/models/airFreight.model';
import { Freight } from '@/freight/models/freight.model'; 
import { UniqueConstraintError } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class CreateAirFreightStrategy implements ICreateAirFreightStrategy {
  constructor(
    @InjectModel(Freight)
    private readonly freightRepository: typeof Freight,
  ) {}

  async create(airFreightData: CreateAirFreightDto): Promise<AirFreight> {
    const freight = await this.freightRepository.findByPk(airFreightData.freight_id);
    
    if (!freight) {
      throw new NotFoundException('Freight not found');
    }

    const airFreight = new AirFreight();
    airFreight.price_0K = airFreightData.price_0K;
    airFreight.price_45K = airFreightData.price_45K;
    airFreight.price_100K = airFreightData.price_100K;
    airFreight.price_300K = airFreightData.price_300K;
    airFreight.price_500K = airFreightData.price_500K;
    airFreight.freight_id = airFreightData.freight_id;

    try {
      await airFreight.save();
      return airFreight;
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        throw new ConflictException(err.errors[0].message);
      }
      throw new ConflictException('Failed to create air freight');
    }
  }
}

