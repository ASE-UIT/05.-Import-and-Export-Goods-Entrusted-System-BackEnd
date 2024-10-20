import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Contract } from './models/contract.model';
import { Employee } from '@/employees/models/employee.model';

@Module({
    imports: [SequelizeModule.forFeature([Contract, Employee])],
    controllers: [],
    providers: [

    ],
})
export class ContractsModule { }
