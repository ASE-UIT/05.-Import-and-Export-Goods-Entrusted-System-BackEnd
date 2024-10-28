import { CreatePaymentDto } from '@/payment/dtos/CreatePaymentDto';
import { Payment } from '@/payment/models/payment.model';

export interface IUpdateInvoiceStrategy {
  update(
    paymentId: string,
    udpateInfo: Partial<CreatePaymentDto>,
  ): Promise<Payment>;
}
