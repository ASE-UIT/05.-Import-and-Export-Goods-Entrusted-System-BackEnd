import { Module } from '@nestjs/common';
import { LandFreightController } from './landFreight.controller';
import { LandFreightService } from './landFreight.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { LandFreight } from './models/landFreight.model';
import { FindLandFreightByPrice100_200Strategy } from './strategies/find-land-freight/find-by-price-100-200.strategy';
import { FindLandFreightByPrice200_500Strategy } from './strategies/find-land-freight/find-by-price-200-500.strategy';
import { FindLandFreightByPrice500_1500Strategy } from './strategies/find-land-freight/find-by-price-500-1500.strategy';
import { FindLandFreightByPrice1500_5000Strategy } from './strategies/find-land-freight/find-by-price-1500-5000.strategy';
import { FindLandFreightByPrice5000_10000Strategy } from './strategies/find-land-freight/find-by-price-5000-10000.strategy';
import { FindLandFreightByPrice10000Strategy } from './strategies/find-land-freight/find-by-price-10000.strategy';
import { FindAllLandFreightStrategy } from './strategies/find-land-freight/find-all.strategy';
import { CreateLandFreightStrategy } from './strategies/create-land-freight/create-land-freight.strategy';
import { UpdateLandFreightStrategy } from './strategies/update-land-freight/update-land-freight.strategy';
import { FindLandFreightByPrice0_100Strategy } from './strategies/find-land-freight/find-by-price-0-100.strategy';
import { FindLandFreightByFreightIdStrategy } from './strategies/find-land-freight/find-by-freight-id.strategy';
import { Freight } from '@/freight/models/freight.model';

@Module({
  imports: [SequelizeModule.forFeature([LandFreight, Freight])],
  controllers: [LandFreightController],
  providers: [
    LandFreightService,
    FindLandFreightByPrice0_100Strategy,
    FindLandFreightByPrice100_200Strategy,
    FindLandFreightByPrice200_500Strategy,
    FindLandFreightByPrice500_1500Strategy,
    FindLandFreightByPrice1500_5000Strategy,
    FindLandFreightByPrice5000_10000Strategy,
    FindLandFreightByPrice10000Strategy,
    FindLandFreightByFreightIdStrategy,
    FindAllLandFreightStrategy,
    CreateLandFreightStrategy,
    UpdateLandFreightStrategy,
  ],
})
export class LandFreightModule {}
