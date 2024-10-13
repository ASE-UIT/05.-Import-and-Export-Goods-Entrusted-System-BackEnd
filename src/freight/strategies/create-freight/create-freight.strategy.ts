import { ConflictException, Injectable } from '@nestjs/common';
import { ICreateFreightStrategy } from './create-freight-strategy.interface';
import { CreateFreightDto } from '@/freight/dtos/CreateFreightDto';
import { Freight } from '@/freight/models/freight.model';
import { UniqueConstraintError } from 'sequelize';

@Injectable()
export class CreateFreightStrategy implements ICreateFreightStrategy {
  async create(freightData: CreateFreightDto): Promise<Freight> {
    const freight = new Freight();
    freight.providerId = freightData.providerId;
    freight.freightType = freightData.freightType;
    freight.origin = freightData.origin;
    freight.destination = freightData.destination;
    freight.transit = freightData.transit;
    freight.transitTime = freightData.transitTime;
    freight.validFrom = freightData.validFrom;
    freight.validUntil = freightData.validUntil;
    freight.note = freightData.note;
    freight.freeTime = freightData.freeTime;
    
    try {
      await freight.save();
      return freight;
    }
    catch(err) {
      if (err instanceof UniqueConstraintError) {
        throw new ConflictException(err.errors[0].message);
      }
    }
  }
}