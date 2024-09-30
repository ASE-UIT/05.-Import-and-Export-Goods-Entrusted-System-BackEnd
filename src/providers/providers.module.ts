import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Provider } from './models/provider.model';
import { ProvidersController } from './providers.controller';
import { ProvidersService } from './providers.service';

@Module({
  imports: [SequelizeModule.forFeature([Provider])],
  controllers: [ProvidersController],
  providers: [ProvidersService],
})
export class ProvidersModule {}
