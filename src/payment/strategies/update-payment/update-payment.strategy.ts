import { CreatePaymentDto } from '@/payment/dtos/create-payment.dto';
import { Payment } from '@/payment/models/payment.model';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class UpdatePaymentStrategy implements UpdatePaymentStrategy {
  constructor(
    @InjectModel(Payment)
    private paymentModel: typeof Payment,
  ) {}
  async update(
    paymentId: string,
    udpateInfo: Partial<CreatePaymentDto>,
  ): Promise<Payment> {
    try {
      const [affetedRows, [updateData]] = await Payment.update(
        { ...udpateInfo },
        { where: { id: paymentId }, returning: true },
      );
      return updateData.dataValues as Payment;
    } catch (err) {
      if (err instanceof TypeError) {
        throw new NotFoundException('Payment not found');
      }
    }
  }
}
