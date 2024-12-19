import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Contract } from './models/contract.model';
import { Employee } from '@/employees/models/employee.model';
import { ContractsController } from './contracts.controller';
import { CreateServiceStrategy } from '@/services/strategies/create-service/creata-service-strategy';
import { ContractsService } from './contracts.service';
import { Quotation } from '@/quotations/models/quotations.model';
import { CreateContractStrategy } from './strategies/create-contract/create-contract.strategy';
import { FindAllContractStrategy } from './strategies/find-contract/find-all.strategy';
import { FindContractByIdStrategy } from './strategies/find-contract/find-by-id.strategy';
import { FindContractByStartDateStrategy } from './strategies/find-contract/find-by-start-date.strategy';
import { FindContractByEndDateStrategy } from './strategies/find-contract/find-by-end-date.strategy';
import { FindContractByStatusStrategy } from './strategies/find-contract/find-by-status.strategy';
import { FindContractByContractDateStrategy } from './strategies/find-contract/find-by-contract-date.strategy';
import { FindContractByEmployeeIdStrategy } from './strategies/find-contract/find-by-employee-id.strategy';
import { FindContractByQuotationIdStrategy } from './strategies/find-contract/find-by-quotation-id.strategy';
import { UpdateContractStrategy } from './strategies/update-contract/update-contract.strategy';
import { FindContractStrategy } from './strategies/find-contract/find-contract.strategy';
import { User } from '@/users/models/user.model';

@Module({
  imports: [SequelizeModule.forFeature([Contract, Employee, Quotation, User])],
  controllers: [ContractsController],
  providers: [
    ContractsService,
    CreateContractStrategy,
    UpdateContractStrategy,
    FindContractStrategy,
  ],
})
export class ContractsModule {}
