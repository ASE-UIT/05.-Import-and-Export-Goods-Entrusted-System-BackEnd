import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { RolesModule } from './roles/roles.module';
import { EmployeesModule } from './employees/employees.module';
import { LegalRepsModule } from './legalReps/legalReps.module';
import { CustomersModule } from './customers/customers.module';
import { ProvidersModule } from './providers/providers.module';
import { QuotationReqsModule } from './quotationReqs/quotationReqs.module';
import { ServicesModule } from './services/services.module';
import { QuotationsModule } from './quotations/quotations.module';
import { QuotationServicesModule } from './quotation-services/quotation-services.module';
import { SessionModule } from './session/session.module';
import { InvoicesModule } from './invoices/invoices.module';
import { QuoteReqDetailsModule } from './quoteReqDetails/quoteReqDetails.module';
import { PackageDetail } from './packageDetails/models/packageDetails.model';
import { PackageDetailModule } from './packageDetails/packageDetails.module';
import { FreightModule } from './freight/freight.module';
import { AirFreightModule } from './airFreight/airFreight.module';
import { SeaFreightModule } from './seaFreight/seaFreight.module';
import { LandFreightModule } from './landFreight/landFreight.module';
import { ContactRepsModule } from './contactReps/contactReps.module';
import { PaymentModule } from './payment/payment.module';
import { ContractsModule } from './contracts/contracts.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        port: 5432,
        host: configService.getOrThrow<string>('POSTGRES_HOST'),
        username: configService.getOrThrow<string>('POSTGRES_USER'),
        password: configService.getOrThrow<string>('POSTGRES_PASSWORD'),
        database: configService.getOrThrow<string>('POSTGRES_DB'),
        autoLoadModels: true,
        sync: { alter: false, force: true },
        logging: false,
      }),
    }),

    UsersModule,
    RolesModule,
    EmployeesModule,
    FreightModule,
    LegalRepsModule,
    CustomersModule,
    ProvidersModule,
    QuotationReqsModule,
    ServicesModule,
    QuotationsModule,
    QuotationServicesModule,
    QuoteReqDetailsModule,
    PackageDetailModule,
    SessionModule,
    InvoicesModule,
    AirFreightModule,
    SeaFreightModule,
    LandFreightModule,
    PaymentModule,
    ContractsModule,
    ContactRepsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
