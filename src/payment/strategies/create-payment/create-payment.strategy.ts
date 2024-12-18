import { Payment } from '@/payment/models/payment.model';
import { ConflictException, Injectable } from '@nestjs/common';
import { ICreatePaymentStrategy } from './create-payment-strategy.interface';
import { CreatePaymentDto } from '@/payment/dtos/create-payment.dto';
import { InjectModel } from '@nestjs/sequelize';
import { ForeignKeyConstraintError } from 'sequelize';
import { PaymentStatus } from '@/shared/enums/payment-status.enum';

@Injectable()
export class CreatePaymentStrategy implements ICreatePaymentStrategy {
  constructor(
    @InjectModel(Payment)
    private paymentModel: typeof Payment,
  ) {}

  async create(paymentInfo: CreatePaymentDto): Promise<Payment> {
    try {
      const payment = this.paymentModel.create({
        amountPaid: paymentInfo.amountPaid,
        invoiceId: paymentInfo.invoiceId,
        status: PaymentStatus.COMPLETED,
        createdAt: new Date(),
      });
      return payment;
    } catch (err) {
      if (err instanceof ForeignKeyConstraintError) {
        throw new ConflictException('Invoice id not found');
      }
    }
  }
}
