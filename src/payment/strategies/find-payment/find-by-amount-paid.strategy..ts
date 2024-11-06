import { Injectable } from '@nestjs/common';
import { IFindPaymentStrategy } from './find-payment-strategy.interface';
import { Payment } from '@/payment/models/payment.model';

@Injectable()
export class FindPaymentByAmountPaidStrategy implements IFindPaymentStrategy {
  async find(paymentAmountPaid: number): Promise<Payment[] | null> {
    return Payment.findAll({
      where: { amountPaid: paymentAmountPaid },
    });
  }
}
