import { CreatePaymentDto } from '@/payment/dtos/CreatePaymentDto';
import { Payment } from '@/payment/models/payment.model';

export interface ICreatePaymentStrategy {
  create(paymentInfo: CreatePaymentDto): Promise<Payment>;
}
