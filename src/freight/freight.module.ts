import { Module } from '@nestjs/common';
import { FreightController } from './freight.controller';
import { FreightService } from './freight.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Freight } from './models/freight.model';
import { FindFreightByDestinationStrategy } from './strategies/find-freight/find-by-destination.strategy';
import { FindFreightByOriginStrategy } from './strategies/find-freight/find-by-origin.strategy';
import { FindFreightByProviderIdStrategy } from './strategies/find-freight/find-by-provider-id.strategy';
import { FindFreightByTransitTimeStrategy } from './strategies/find-freight/find-by-transit-time.strategy';
import { FindFreightByTransitStrategy } from './strategies/find-freight/find-by-transit.strategy';
import { FindFreightByTypeStrategy } from './strategies/find-freight/find-by-type.strategy';
import { FindFreightByValidFromStrategy } from './strategies/find-freight/find-by-valid-from.strategy';
import { FindFreightByValidUntilStrategy } from './strategies/find-freight/find-by-valid-until.strategy';
import { FindAllFreightStrategy } from './strategies/find-freight/find-all.strategy';
import { CreateFreightStrategy } from './strategies/create-freight/create-freight.strategy';
import { UpdateFreightStrategy } from './strategies/update-freight/update-freight.strategy';

@Module({
  imports: [SequelizeModule.forFeature([Freight])],
  controllers: [FreightController],
  providers: [
    FreightService,
    FindFreightByDestinationStrategy,
    FindFreightByOriginStrategy,
    FindFreightByProviderIdStrategy,
    FindFreightByTransitStrategy,
    FindFreightByTransitTimeStrategy,
    FindFreightByTypeStrategy,
    FindFreightByValidFromStrategy,
    FindFreightByValidUntilStrategy,
    FindAllFreightStrategy,
    CreateFreightStrategy,
    UpdateFreightStrategy,
  ],
})
export class FreightModule {}
