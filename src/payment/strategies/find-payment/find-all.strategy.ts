import { Injectable } from '@nestjs/common';
import { IFindPaymentStrategy } from './find-payment-strategy.interface';
import { Payment } from '@/payment/models/payment.model';

@Injectable()
export class FindAllPaymentStrategy implements IFindPaymentStrategy {
  async find(): Promise<Payment[] | null> {
    return Payment.findAll();
  }
}
