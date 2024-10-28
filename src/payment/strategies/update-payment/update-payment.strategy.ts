import { CreatePaymentDto } from '@/payment/dtos/CreatePaymentDto';
import { Payment } from '@/payment/models/payment.model';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class UpdatePaymentStrategy implements UpdatePaymentStrategy {
  async update(
    paymentId: string,
    udpateInfo: Partial<CreatePaymentDto>,
  ): Promise<Payment> {
    const [affetedRows, [updateData]] = await Payment.update(
      { ...udpateInfo },
      { where: { id: paymentId }, returning: true },
    );
    if (affetedRows === 0) {
      throw new BadRequestException("Payment doesn't exist");
    }
    return updateData.dataValues as Payment;
  }
}
