import { ConflictException, Injectable } from '@nestjs/common';
import { ICreateAirFreightStrategy } from './create-air-freight-strategy.interface';
import { CreateAirFreightDto } from '@/airFreight/dtos/CreateAirFreightDto'; 
import { AirFreight } from '@/airFreight/models/airFreight.model';
import { UniqueConstraintError } from 'sequelize';

@Injectable()
export class CreateAirFreightStrategy implements ICreateAirFreightStrategy {
  async create(airFreightData: CreateAirFreightDto): Promise<AirFreight> {
    const airFreight = new AirFreight();
    airFreight["45K"] = airFreightData["45K"];
    airFreight["100K"] = airFreightData["100K"];
    airFreight["300K"] = airFreightData["300K"];
    airFreight["500K"] = airFreightData["500K"];
    airFreight.FSC = airFreightData.FSC;
    airFreight.AMS_Fees = airFreightData.AMS_Fees;
    airFreight.SCC = airFreightData.SCC;
    airFreight.routine = airFreightData.routine;
    airFreight.freight_id = airFreightData.freight_id;

    try {
      await airFreight.save();
      return airFreight;
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        throw new ConflictException(err.errors[0].message);
      }
    }
  }
}
