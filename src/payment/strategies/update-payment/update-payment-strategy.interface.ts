import { CreatePaymentDto } from '@/payment/dtos/create-payment.dto';
import { Payment } from '@/payment/models/payment.model';

export interface IUpdateInvoiceStrategy {
  update(
    paymentId: string,
    udpateInfo: Partial<CreatePaymentDto>,
  ): Promise<Payment>;
}
