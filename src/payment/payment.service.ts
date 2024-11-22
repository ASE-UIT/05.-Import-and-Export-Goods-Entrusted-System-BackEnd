import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentStrategy } from './strategies/create-payment/create-payment.strategy';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { Payment } from './models/payment.model';
import { FindPaymentByIdStrategy } from './strategies/find-payment/find-by-id.strategy';
import { FindAllPaymentStrategy } from './strategies/find-payment/find-all.strategy';
import { FindPaymentByAmountPaidStrategy } from './strategies/find-payment/find-by-amount-paid.strategy.';
import { FindPaymentByStatusStrategy } from './strategies/find-payment/find-by-status.strategy';
import { FindPaymentByInvoiceIdStrategy } from './strategies/find-payment/find-by-invoice-id.strategy';
import { UpdatePaymentStrategy } from './strategies/update-payment/update-payment.strategy';

import { IFindPaymentStrategy } from './strategies/find-payment/find-payment-strategy.interface';
import { FindPaymentStrategy } from './strategies/find-payment/find-payment.strategy';
import { QueryPaymentDto } from './dtos/query-payment.dto';
import { PaymentStatus } from '@/shared/enums/payment-status.enum';
import { UpdatePaidDateInvoiceStrategy } from '@/invoices/strategies/update-invoice/update-paid-date-invoice.strategy';
import { InvoicesService } from '@/invoices/invoices.service';
import { UpdatePaymentDto } from './dtos/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private updatePaymentStrategy: UpdatePaymentStrategy,
    private createPaymentStrategy: CreatePaymentStrategy,
    private findPaymentStrategy: FindPaymentStrategy,
    private invoiceService: InvoicesService,
  ) {}

  async create(paymentInfo: CreatePaymentDto): Promise<Payment> {
    const createdPayment = await this.createPaymentStrategy.create(paymentInfo);
    if (createdPayment.status === PaymentStatus.COMPLETED) {
      const invoiceId = createdPayment.invoiceId;
      await this.invoiceService.updateInvoice(invoiceId, createdPayment);
    }
    return createdPayment;
  }

  async find(paymentInfo: QueryPaymentDto): Promise<Payment[]> {
    const foundPayment = await this.findPaymentStrategy.find(paymentInfo);
    return foundPayment;
  }

  async update(
    paymentID: string,
    updateInfo: UpdatePaymentDto,
  ): Promise<Payment> {
    if (Object.keys(updateInfo).length < 1) {
      throw new BadRequestException('Body is empty or invalid field names');
    }
    const updatedResponse = await this.updatePaymentStrategy.update(
      paymentID,
      updateInfo,
    );
    return updatedResponse;
  }
}
