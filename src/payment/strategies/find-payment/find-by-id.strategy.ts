import { Injectable } from '@nestjs/common';
import { IFindPaymentStrategy } from './find-payment-strategy.interface';
import { Payment } from '@/payment/models/payment.model';

@Injectable()
export class FindPaymentByIdStrategy implements IFindPaymentStrategy {
  async find(paymentId: string): Promise<Payment[] | null> {
    return Payment.findAll({
      where: { id: paymentId },
    });
  }
}
