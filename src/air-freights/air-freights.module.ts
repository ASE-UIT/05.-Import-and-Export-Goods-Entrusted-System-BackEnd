import { Module } from '@nestjs/common';
import { AirFreightController } from './air-freights.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { AirFreight } from './models/air-freights.model';
import { CreateAirFreightStrategy } from './strategies/create-air-freights/create-air-freights.strategy';
import { UpdateAirFreightStrategy } from './strategies/update-air-freights/update-air-freights.strategy';
import { AirFreightService } from './air-freights.service';
import { Freight } from '@/freights/models/freights.model';

@Module({
  imports: [SequelizeModule.forFeature([AirFreight, Freight])],
  controllers: [AirFreightController],
  providers: [ 
    AirFreightService,
    CreateAirFreightStrategy,
    UpdateAirFreightStrategy,
  ],
})
export class AirFreightModule {}
