import { Module } from '@nestjs/common';
import { AirFreightController } from './airFreight.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { AirFreight } from './models/airFreight.model';
import { FindAirFreightByPrice45kStrategy } from './strategies/find-air-freight/find-by-price-45k.strategy';
import { FindAirFreightByPrice100kStrategy } from './strategies/find-air-freight/find-by-price-100k.strategy';
import { FindAirFreightByPrice300kStrategy } from './strategies/find-air-freight/find-by-price-300k.strategy';
import { FindAirFreightByPrice500kStrategy } from './strategies/find-air-freight/find-by-price-500k.strategy';
import { FindAirFreightByPrice0kStrategy } from './strategies/find-air-freight/find-by-price-0k.strategy';
import { FindAllAirFreightStrategy } from './strategies/find-air-freight/find-all.strategy';
import { CreateAirFreightStrategy } from './strategies/create-air-freight/create-air-freight.strategy';
import { UpdateAirFreightStrategy } from './strategies/update-air-freight/update-air-freight.strategy';
import { AirFreightService } from './airFreight.service';
import { FindAirFreightByFreightIdStrategy } from './strategies/find-air-freight/find-by-freight-id.strategy';
import { Freight } from '@/freight/models/freight.model';

@Module({
  imports: [SequelizeModule.forFeature([AirFreight, Freight])],
  controllers: [AirFreightController],
  providers: [ 
    AirFreightService,
    FindAirFreightByPrice0kStrategy,
    FindAirFreightByPrice45kStrategy,
    FindAirFreightByPrice100kStrategy,
    FindAirFreightByPrice300kStrategy,
    FindAirFreightByPrice500kStrategy,
    FindAirFreightByFreightIdStrategy,
    FindAllAirFreightStrategy,
    CreateAirFreightStrategy,
    UpdateAirFreightStrategy,
  ],
})
export class AirFreightModule {}
