import { Module } from '@nestjs/common';
import { FreightController } from './freights.controller';
import { FreightService } from './freights.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Freight } from './models/freights.model';
import { CreateFreightStrategy } from './strategies/create-freights/create-freights.strategy';
import { UpdateFreightStrategy } from './strategies/update-freights/update-freights.strategy';
import { Provider } from '@/providers/models/providers.model';

@Module({
  imports: [SequelizeModule.forFeature([Freight, Provider])],
  controllers: [FreightController],
  providers: [
    FreightService,
    CreateFreightStrategy,
    UpdateFreightStrategy,
  ],
})
export class FreightModule {}
