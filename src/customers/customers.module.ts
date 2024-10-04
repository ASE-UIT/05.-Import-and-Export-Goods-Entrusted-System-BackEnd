import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Customer } from './models/customer.model';
import { FindCustomerByEmailStrategy } from './strategies/find-customer/find-by-email.strategy';
import { FindCustomerByNameStrategy } from './strategies/find-customer/find-by-name.strategy';
import { FindCustomerByPhoneStrategy } from './strategies/find-customer/find-by-phone.strategy';
import { FindAllCustomerStrategy } from './strategies/find-customer/find-all.strategy';

@Module({
  imports: [SequelizeModule.forFeature([Customer])],
  controllers: [CustomersController],
  providers: [
    CustomersService,
    FindCustomerByEmailStrategy,
    FindCustomerByNameStrategy,
    FindCustomerByPhoneStrategy,
    FindAllCustomerStrategy,
  ],
})
export class CustomersModule {}
