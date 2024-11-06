import { Payment } from '@/payment/models/payment.model';

export interface IFindPaymentStrategy {
  find(paymentInfo: any): Promise<Payment[] | null>;
}
