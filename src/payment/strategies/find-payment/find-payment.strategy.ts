import { Injectable } from '@nestjs/common';
import { IFindPaymentStrategy } from './find-payment-strategy.interface';
import { InjectModel } from '@nestjs/sequelize';
import { Payment } from '@/payment/models/payment.model';
import { QueryPaymentDto } from '@/payment/dtos/query-payment.dto';

@Injectable()
export class FindPaymentStrategy implements IFindPaymentStrategy {
  constructor(
    @InjectModel(Payment)
    private paymentModel: typeof Payment,
  ) {}
  async find(paymentInfo: QueryPaymentDto): Promise<Payment[] | null> {
    if (Object.keys(paymentInfo).length < 1)
      return await this.paymentModel.findAll();
    return await this.paymentModel.findAll({ where: paymentInfo });
  }
}
