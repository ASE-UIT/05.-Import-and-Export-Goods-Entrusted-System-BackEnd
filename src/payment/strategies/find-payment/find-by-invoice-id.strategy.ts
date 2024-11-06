import { Injectable } from '@nestjs/common';
import { IFindPaymentStrategy } from './find-payment-strategy.interface';
import { Payment } from '@/payment/models/payment.model';

@Injectable()
export class FindPaymentByInvoiceIdStrategy implements IFindPaymentStrategy {
  async find(paymentInvoiceId: string): Promise<Payment[] | null> {
    return Payment.findAll({
      where: { invoiceId: paymentInvoiceId },
    });
  }
}
