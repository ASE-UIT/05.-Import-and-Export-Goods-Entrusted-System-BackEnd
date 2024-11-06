import { Module } from '@nestjs/common';
import { LandFreightController } from './land-freights.controller';
import { LandFreightService } from './land-freights.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { CreateLandFreightStrategy } from './strategies/create-land-freights/create-land-freights.strategy';
import { UpdateLandFreightStrategy } from './strategies/update-land-freights/update-land-freights.strategy';
import { Freight } from '@/freights/models/freights.model';
import { LandFreight } from './models/land-freights.model';

@Module({
  imports: [SequelizeModule.forFeature([LandFreight, Freight])],
  controllers: [LandFreightController],
  providers: [
    LandFreightService,
    CreateLandFreightStrategy,
    UpdateLandFreightStrategy,
  ],
})
export class LandFreightModule {}
