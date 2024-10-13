import { Module } from '@nestjs/common';
import { SeaFreightController } from './seafreight.controller';
import { SeaFreightService } from './seafreight.service'; 
import { SequelizeModule } from '@nestjs/sequelize';
import { SeaFreight } from './models/seafreight.model'; 
import { FindSeaFreightByPrice20dcStrategy } from './strategies/find-sea-freight/find-by-price-20dc.strategy'; 
import { FindSeaFreightByPrice20rfStrategy } from './strategies/find-sea-freight/find-by-price-20rf.strategy'; 
import { FindSeaFreightByPrice40dcStrategy } from './strategies/find-sea-freight/find-by-price-40dc.strategy'; 
import { FindSeaFreightByPrice40hcStrategy } from './strategies/find-sea-freight/find-by-price-40hc.strategy'; 
import { FindSeaFreightByPrice40rfStrategy } from './strategies/find-sea-freight/find-by-price-40rf.strategy'; 
import { FindAllSeaFreightStrategy } from './strategies/find-sea-freight/find-all.strategy'; 
import { CreateSeaFreightStrategy } from './strategies/create-sea-freight/create-sea-freight.strategy'; 
import { UpdateSeaFreightStrategy } from './strategies/update-sea-freight/update-sea-freight.strategy'; 

@Module({
  imports: [SequelizeModule.forFeature([SeaFreight])], 
  controllers: [SeaFreightController], 
  providers: [
    SeaFreightService, 
    FindSeaFreightByPrice20dcStrategy,
    FindSeaFreightByPrice20rfStrategy,
    FindSeaFreightByPrice40dcStrategy,
    FindSeaFreightByPrice40hcStrategy,
    FindSeaFreightByPrice40rfStrategy,
    FindAllSeaFreightStrategy,
    CreateSeaFreightStrategy,
    UpdateSeaFreightStrategy,
  ],
})
export class SeaFreightModule {}
