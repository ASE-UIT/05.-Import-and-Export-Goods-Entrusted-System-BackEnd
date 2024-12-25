import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { EmployeesModule } from './employees/employees.module';
import { CustomersModule } from './customers/customers.module';
import { ProvidersModule } from './providers/providers.module';
import { QuotationReqsModule } from './quotation-requests/quotation-requests.module';
import { ServicesModule } from './services/services.module';
import { QuotationsModule } from './quotations/quotations.module';
import { QuotationServicesModule } from './quotation-services/quotation-services.module';
import { SessionModule } from './session/session.module';
import { InvoicesModule } from './invoices/invoices.module';
import { QuoteReqDetailsModule } from './quote-request-details/quote-request-details.module';
import { PackageDetailModule } from './package-details/package-details.module';
import { FreightModule } from './freights/freights.module';
import { AirFreightModule } from './air-freights/air-freights.module';
import { LandFreightModule } from './land-freights/land-freights.module';
import { ContactRepsModule } from './contact-representatives/contact-representatives.module';
import { PaymentModule } from './payment/payment.module';
import { ContractsModule } from './contracts/contracts.module';
import { ShipmentModule } from './shipment/shipment.module';
import { DocumentModule } from './document/document.module';
import { ShipmentTrackingModule } from './shipment-tracking/shipment-tracking.module';
import { LegalRepsModule } from './legal-representative/legal-rep.module';
import { RolesModule } from './roles/roles.module';
import { FCLModule } from './fcls/fcls.module';
import { LCLModule } from './lcls/lcls.module';
import { ContactRepFirmRepModule } from './contact-representatives-firm-representatives/contact-firm-representatives.module';
import { FirmRepsModule } from './firm-representatives/firm-representatives.module';

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
        logging: false,
      }),
    }),
    UsersModule,
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
    LandFreightModule,
    PaymentModule,
    ContractsModule,
    ContactRepsModule,
    ShipmentModule,
    DocumentModule,
    ShipmentTrackingModule,
    RolesModule,
    FCLModule,
    LCLModule,
    FirmRepsModule,
    ContactRepFirmRepModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
