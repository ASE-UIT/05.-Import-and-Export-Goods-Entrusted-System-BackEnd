import { Module } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UsersRepository],
})
export class UsersModule {}
