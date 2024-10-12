import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Service } from './models/service.model';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { FindAllServiceStrategy } from './strategies/find-service/find-all.strategy';
import { FindServiceByFeeStrategy } from './strategies/find-service/find-by-fee.strategy';
import { FindServiceByNameStrategy } from './strategies/find-service/find-by-name.strategy';
import { FindServiceByShortNameStrategy } from './strategies/find-service/find-by-shortname.strategy';
import { CreateServiceStrategy } from './strategies/create-service/creata-service-strategy';
import { UpdateServiceStrategy } from './strategies/update-service/update-service.strategy';

@Module({
  imports: [SequelizeModule.forFeature([Service])],
  providers: [
    ServicesService,
    FindAllServiceStrategy,
    FindServiceByFeeStrategy,
    FindServiceByNameStrategy,
    FindServiceByShortNameStrategy,
    CreateServiceStrategy,
    UpdateServiceStrategy,
  ],
  controllers: [ServicesController],
})
export class ServicesModule {}
