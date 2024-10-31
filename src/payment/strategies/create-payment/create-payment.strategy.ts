import { Payment } from '@/payment/models/payment.model';
import { Injectable } from '@nestjs/common';
import { ICreatePaymentStrategy } from './create-payment-strategy.interface';
import { CreatePaymentDto } from '@/payment/dtos/CreatePaymentDto';

@Injectable()
export class CreatePaymentStrategy implements ICreatePaymentStrategy {
  async create(paymentInfo: CreatePaymentDto): Promise<Payment> {
    const payment = new Payment();
    payment.amountPaid = paymentInfo.amountPaid;
    payment.status = paymentInfo.status;
    payment.invoiceId = paymentInfo.invoiceId;
    await payment.save();
    return payment;
  }
}
