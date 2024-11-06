import { Module } from '@nestjs/common';
import { ProvidersController } from './providers.controller';
import { ProvidersService } from './providers.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Provider } from './models/providers.model';
import { CreateProviderStrategy } from './strategies/create-providers/create-providers.strategy';
import { UpdateProviderStrategy } from './strategies/update-providers/update-providers.strategy';
import { Freight } from '@/freights/models/freights.model';
import { ContactRep } from '@/contact-representatives/models/contact-representatives.model';

@Module({
  imports: [SequelizeModule.forFeature([Provider, ContactRep, Freight])],
  controllers: [ProvidersController],
  providers: [
    ProvidersService,
    CreateProviderStrategy,
    UpdateProviderStrategy,
  ],
})
export class ProvidersModule { }
