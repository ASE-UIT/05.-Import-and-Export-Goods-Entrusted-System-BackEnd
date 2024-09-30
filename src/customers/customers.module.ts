import { Module } from '@nestjs/common';
import e from 'express';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Customer } from './models/customer.model';

@Module({
  imports: [SequelizeModule.forFeature([Customer])],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}
