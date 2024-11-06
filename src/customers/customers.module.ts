import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Customer } from './models/customer.model';
import { CreateCustomerStrategy } from './strategies/create-customer/create-customer.strategy';
import { UpdateCustomerStrategy } from './strategies/update-customer/update-customer.strategy';

@Module({
  imports: [SequelizeModule.forFeature([Customer])],
  controllers: [CustomersController],
  providers: [CustomersService, CreateCustomerStrategy, UpdateCustomerStrategy],
})
export class CustomersModule {}
