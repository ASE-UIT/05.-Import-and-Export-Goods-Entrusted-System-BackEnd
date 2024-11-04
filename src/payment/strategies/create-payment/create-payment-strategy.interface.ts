import { CreatePaymentDto } from '@/payment/dtos/create-payment.dto';
import { Payment } from '@/payment/models/payment.model';

export interface ICreatePaymentStrategy {
  create(paymentInfo: CreatePaymentDto): Promise<Payment>;
}
