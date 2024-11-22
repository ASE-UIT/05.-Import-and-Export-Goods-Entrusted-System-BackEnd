import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Employee } from '@/employees/models/employee.model';
import { Payment } from './models/payment.model';
import { Invoice } from '@/invoices/models/invoice.model';
import { PaymentsController } from './payment.controller';
import { CreatePaymentStrategy } from './strategies/create-payment/create-payment.strategy';
import { PaymentsService } from './payment.service';
import { FindAllPaymentStrategy } from './strategies/find-payment/find-all.strategy';
import { FindPaymentByIdStrategy } from './strategies/find-payment/find-by-id.strategy';
import { FindPaymentByAmountPaidStrategy } from './strategies/find-payment/find-by-amount-paid.strategy.';
import { FindPaymentByStatusStrategy } from './strategies/find-payment/find-by-status.strategy';
import { FindPaymentByInvoiceIdStrategy } from './strategies/find-payment/find-by-invoice-id.strategy';
import { UpdatePaymentStrategy } from './strategies/update-payment/update-payment.strategy';
import { FindPaymentStrategy } from './strategies/find-payment/find-payment.strategy';
import { UpdatePaidDateInvoiceStrategy } from '@/invoices/strategies/update-invoice/update-paid-date-invoice.strategy';
import { InvoicesService } from '@/invoices/invoices.service';
import { InvoicesModule } from '@/invoices/invoices.module';

@Module({
  imports: [SequelizeModule.forFeature([Payment, Invoice]), InvoicesModule],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    FindAllPaymentStrategy,
    FindPaymentByIdStrategy,
    FindPaymentByAmountPaidStrategy,
    FindPaymentByStatusStrategy,
    FindPaymentByInvoiceIdStrategy,
    UpdatePaymentStrategy,
    CreatePaymentStrategy,
    FindPaymentStrategy,
    UpdatePaidDateInvoiceStrategy,
  ],
})
export class PaymentModule {}
