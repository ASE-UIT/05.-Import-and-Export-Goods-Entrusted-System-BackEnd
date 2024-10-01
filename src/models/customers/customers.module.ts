import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { CustomersRepository } from './customers.repository';

@Module({
  imports: [],
  controllers: [CustomersController],
  providers: [CustomersRepository, CustomersService],
})
export class CustomersModule {}
