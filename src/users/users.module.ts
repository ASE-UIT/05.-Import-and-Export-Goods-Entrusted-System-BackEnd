import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { UsersController } from './users.controller';
import { FindUserByUsernameStrategy } from './strategies/find-user/find-by-username.strategy';
import { FindUserByIdStrategy } from './strategies/find-user/find-by-id.strategy';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [UsersService, FindUserByUsernameStrategy, FindUserByIdStrategy],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
