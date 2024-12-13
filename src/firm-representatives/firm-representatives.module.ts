import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FirmRepsService } from './firm-representatives.service';
import { FirmRep } from './models/firm-representatives.model';
import { FirmRepsController } from './firm-representatives.controller';
import { CreateFirmRepsStrategy } from './strategies/create-firm-representatives/create-firm-representatives.strategy';
import { UpdateFirmRepsStrategy } from './strategies/update-firm-representatives/update-firm-representatives.strategy';

@Module({
  imports: [SequelizeModule.forFeature([FirmRep])],
  controllers: [FirmRepsController],
  providers: [
    FirmRepsService,
    CreateFirmRepsStrategy,
    UpdateFirmRepsStrategy,
  ],
})
export class FirmRepsModule {}
