import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './session-local.strategy';
import { SessionController } from './session.controller';
import { SessionSerializer } from './session.serializer';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [PassportModule, UsersModule],
  providers: [SessionService, SessionSerializer, LocalStrategy],
  controllers: [SessionController],
})
export class SessionModule {}
