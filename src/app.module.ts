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
<<<<<<< HEAD
import { ServicesModule } from './services/services.module';
import { QuotationsModule } from './quotations/quotations.module';
import { QuotationServicesModule } from './quotation-services/quotation-services.module';
=======
import { SessionModule } from './session/session.module';
>>>>>>> e00b54ed4e671048373681e9803125afd318e87a

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
        sync: { alter: true },
      }),
    }),

    UsersModule,
    RolesModule,
    EmployeesModule,
    LegalRepsModule,
    CustomersModule,
    ProvidersModule,
    QuotationReqsModule,
<<<<<<< HEAD
    ServicesModule,
    QuotationsModule,
    QuotationServicesModule,
    ServicesModule,
=======
    SessionModule,
>>>>>>> e00b54ed4e671048373681e9803125afd318e87a
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
