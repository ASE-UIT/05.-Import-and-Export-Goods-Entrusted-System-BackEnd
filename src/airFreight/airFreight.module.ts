import { Module } from '@nestjs/common';
import { AirFreightController } from './airfreight.controller';
import { AirFreightService } from './airfreight.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AirFreight } from './models/airfreight.model';
import { FindAirFreightByPrice45kStrategy } from './strategies/find-air-freight/find-by-price-45k.strategy';
import { FindAirFreightByPrice100kStrategy } from './strategies/find-air-freight/find-by-price-100k.strategy';
import { FindAirFreightByPrice300kStrategy } from './strategies/find-air-freight/find-by-price-300k.strategy';
import { FindAirFreightByPrice500kStrategy } from './strategies/find-air-freight/find-by-price-500k.strategy';
import { FindAirFreightByFscStrategy } from './strategies/find-air-freight/find-by-fsc.strategy';
import { FindAirFreightByAmsFeesStrategy } from './strategies/find-air-freight/find-by-ams-fees.strategy';
import { FindAirFreightBySccStrategy } from './strategies/find-air-freight/find-by-scc.strategy';
import { FindAirFreightByRoutineStrategy } from './strategies/find-air-freight/find-by-routine.strategy';
import { FindAirFreightByFreightIdStrategy } from './strategies/find-air-freight/find-by-freight-id.strategy';
import { FindAllAirFreightStrategy } from './strategies/find-air-freight/find-all.strategy';
import { CreateAirFreightStrategy } from './strategies/create-air-freight/create-air-freight.strategy';
import { UpdateAirFreightStrategy } from './strategies/update-air-freight/update-air-freight.strategy';

@Module({
  imports: [SequelizeModule.forFeature([AirFreight])],
  controllers: [AirFreightController],
  providers: [
    AirFreightService,
    FindAirFreightByPrice45kStrategy,
    FindAirFreightByPrice100kStrategy,
    FindAirFreightByPrice300kStrategy,
    FindAirFreightByPrice500kStrategy,
    FindAirFreightByFscStrategy,
    FindAirFreightByAmsFeesStrategy,
    FindAirFreightBySccStrategy,
    FindAirFreightByRoutineStrategy,
    FindAirFreightByFreightIdStrategy,
    FindAllAirFreightStrategy,
    CreateAirFreightStrategy,
    UpdateAirFreightStrategy,
  ],
})
export class AirFreightModule {}
