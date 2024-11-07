import { Injectable } from '@nestjs/common';
import { IFindPaymentStrategy } from './find-payment-strategy.interface';
import { Payment } from '@/payment/models/payment.model';

@Injectable()
export class FindPaymentByStatusStrategy implements IFindPaymentStrategy {
  async find(paymentStatus: string): Promise<Payment[] | null> {
    return Payment.findAll({
      where: { status: paymentStatus },
    });
  }
}
