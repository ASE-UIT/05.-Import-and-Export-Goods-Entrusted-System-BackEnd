import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Employee } from '@/employees/models/employee.model';
import { Payment } from './models/payment.model';
import { Invoice } from '@/invoices/models/invoice.model';

@Module({
    imports: [SequelizeModule.forFeature([Payment, Invoice])],
    controllers: [],
    providers: [

    ],
})
export class PaymentModule { }
