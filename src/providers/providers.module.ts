import { Module } from '@nestjs/common';
import { ProvidersController } from './providers.controller';
import { ProvidersService } from './providers.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Provider } from './models/provider.model';
import { FindProviderByEmailStrategy } from './strategies/find-provider/find-by-email.strategy';
import { FindProviderByNameStrategy } from './strategies/find-provider/find-by-name.strategy';
import { FindProviderByPhoneStrategy } from './strategies/find-provider/find-by-phone.strategy';
import { FindProviderByCountryStrategy } from './strategies/find-provider/find-by-country.strategy';
import { FindProviderByAddressStrategy } from './strategies/find-provider/find-by-address.strategy';
import { FindAllProviderStrategy } from './strategies/find-provider/find-all.strategy';
import { CreateProviderStrategy } from './strategies/create-provider/create-provider.strategy';
import { UpdateProviderStrategy } from './strategies/update-provider/update-provider.strategy';
import { ContactRep } from '@/contactReps/models/contactReps.model';

@Module({
  imports: [SequelizeModule.forFeature([Provider, ContactRep])],
  controllers: [ProvidersController],
  providers: [
    ProvidersService,
    FindProviderByEmailStrategy,
    FindProviderByNameStrategy,
    FindProviderByPhoneStrategy,
    FindProviderByCountryStrategy,
    FindProviderByAddressStrategy,
    FindAllProviderStrategy,
    CreateProviderStrategy,
    UpdateProviderStrategy,
  ],
})
export class ProvidersModule { }
