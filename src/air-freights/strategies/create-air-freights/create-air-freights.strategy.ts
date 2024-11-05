import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ICreateAirFreightStrategy } from './create-air-freights-strategy.interface';
import { CreateAirFreightDto } from '@/air-freights/dtos/create-air-freights.dto';
import { AirFreight } from '@/air-freights/models/air-freights.model';
import { Freight } from '@/freights/models/freights.model'; 
import { ForeignKeyConstraintError, UniqueConstraintError } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import {
  ValidationError,
  ValidationErrorDetail,
} from '@/shared/classes/validation-error.class';

@Injectable()
export class CreateAirFreightStrategy implements ICreateAirFreightStrategy {
  constructor(
    @InjectModel(AirFreight)
    private airFreightModel: typeof AirFreight,
  ) {}

  async create(airFreightData: CreateAirFreightDto): Promise<AirFreight> {
    try {
      const newAirFreight = await this.airFreightModel.create({
        price_0K: airFreightData.price_0K,
        price_45K: airFreightData.price_45K,
        price_100K: airFreightData.price_100K,
        price_300K: airFreightData.price_300K,
        price_500K: airFreightData.price_500K,
        freight_id: airFreightData.freight_id,
      });
      return newAirFreight;
    } catch (err) {
      if (err instanceof ForeignKeyConstraintError) {
        throw new NotFoundException('Freight not found');
      } 
    }
  }
}
