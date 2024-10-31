import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentStrategy } from './strategies/create-payment/create-payment.strategy';
import { CreatePaymentDto } from './dtos/CreatePaymentDto';
import { Payment } from './models/payment.model';
import { FindPaymentByIdStrategy } from './strategies/find-payment/find-by-id.strategy';
import { FindAllPaymentStrategy } from './strategies/find-payment/find-all.strategy';
import { FindPaymentByAmountPaidStrategy } from './strategies/find-payment/find-by-amount-paid.strategy.';
import { FindPaymentByStatusStrategy } from './strategies/find-payment/find-by-status.strategy';
import { FindPaymentByInvoiceIdStrategy } from './strategies/find-payment/find-by-invoice-id.strategy';
import { UpdatePaymentStrategy } from './strategies/update-payment/update-payment.strategy';
import { FindPaymentStrategy } from './strategies/find-payment/find-payment-strategy.enum';
import { IFindPaymentStrategy } from './strategies/find-payment/find-payment-strategy.interface';

@Injectable()
export class PaymentsService {
  constructor(
    private findAllPaymentStrategy: FindAllPaymentStrategy,
    private findPaymentByIdStrategy: FindPaymentByIdStrategy,
    private findPaymentByAmountPaidStrategy: FindPaymentByAmountPaidStrategy,
    private findPaymentByStatusStrategy: FindPaymentByStatusStrategy,
    private findPaymentByInvoiceIdStrategy: FindPaymentByInvoiceIdStrategy,
    private updatePaymentStrategy: UpdatePaymentStrategy,
    private createPaymentStrategy: CreatePaymentStrategy,
  ) {}

  async create(paymentInfo: CreatePaymentDto): Promise<Payment> {
    const createdPayment = await this.createPaymentStrategy.create(paymentInfo);
    return createdPayment;
  }

  find(strategy: FindPaymentStrategy, paymentInfo: any): Promise<Payment[]> {
    const findStrategy = this.getFindStrategy(strategy);
    const payment = findStrategy.find(paymentInfo);
    return payment;
  }

  getFindStrategy(strategy: FindPaymentStrategy): IFindPaymentStrategy {
    switch (strategy) {
      case FindPaymentStrategy.ALL:
        return this.findAllPaymentStrategy;
      case FindPaymentStrategy.ID:
        return this.findPaymentByIdStrategy;
      case FindPaymentStrategy.AMOUNT_PAID:
        return this.findPaymentByAmountPaidStrategy;
      case FindPaymentStrategy.INVOICE_ID:
        return this.findPaymentByInvoiceIdStrategy;
      case FindPaymentStrategy.STATUS:
        return this.findPaymentByStatusStrategy;
    }
  }

  async update(
    paymentID: string,
    updateInfo: Partial<CreatePaymentDto>,
  ): Promise<Payment> {
    if (Object.keys(updateInfo).length < 1) {
      throw new BadRequestException('Body is empty');
    }
    const updatedResponse = await this.updatePaymentStrategy.update(
      paymentID,
      updateInfo,
    );
    return updatedResponse;
  }
}
