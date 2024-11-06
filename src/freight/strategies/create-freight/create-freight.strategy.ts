import { ConflictException, Injectable } from '@nestjs/common';
import { ICreateFreightStrategy } from './create-freight-strategy.interface';
import { CreateFreightDto } from '@/freight/dtos/CreateFreightDto';
import { Freight } from '@/freight/models/freight.model';
import { UniqueConstraintError } from 'sequelize';

@Injectable()
export class CreateFreightStrategy implements ICreateFreightStrategy {
  async create(freightData: CreateFreightDto): Promise<Freight> {
    const freight = new Freight();
    freight.freightType = freightData.freightType;
    freight.origin = freightData.origin;
    freight.destination = freightData.destination;
    freight.transitTime = freightData.transitTime;
    freight.additionFee = freightData.additionFee;
    freight.addition_fee_breakdown = freightData.addition_fee_breakdown
    freight.validFrom = freightData.validFrom;
    freight.validUntil = freightData.validUntil;
    freight.schedule = freightData.schedule
    freight.providerId = freightData.providerId
    try {
      await freight.save();
      return freight;
    }
    catch (err) {
      if (err instanceof UniqueConstraintError) {
        throw new ConflictException(err.errors[0].message);
      }
    }
  }
}