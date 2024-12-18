import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentStrategy } from './strategies/create-payment/create-payment.strategy';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { Payment } from './models/payment.model';
import { FindPaymentByIdStrategy } from './strategies/find-payment/find-by-id.strategy';
import { FindAllPaymentStrategy } from './strategies/find-payment/find-all.strategy';
import { FindPaymentByAmountPaidStrategy } from './strategies/find-payment/find-by-amount-paid.strategy.';
import { FindPaymentByStatusStrategy } from './strategies/find-payment/find-by-status.strategy';
import { FindPaymentByInvoiceIdStrategy } from './strategies/find-payment/find-by-invoice-id.strategy';
import { UpdatePaymentStrategy } from './strategies/update-payment/update-payment.strategy';

import { IFindPaymentStrategy } from './strategies/find-payment/find-payment-strategy.interface';
import { FindPaymentStrategy } from './strategies/find-payment/find-payment.strategy';
import { QueryPaymentDto } from './dtos/query-payment.dto';
import { PaymentStatus } from '@/shared/enums/payment-status.enum';
import { UpdatePaidDateInvoiceStrategy } from '@/invoices/strategies/update-invoice/update-paid-date-invoice.strategy';
import { InvoicesService } from '@/invoices/invoices.service';
import { UpdatePaymentDto } from './dtos/update-payment.dto';
import { PaginationDto } from '@/shared/dto/pagination.dto';
import { PaginatedResponse } from '@/shared/dto/paginated-response.dto';
import { InjectModel } from '@nestjs/sequelize';
import { PaginationResponse } from '@/shared/dto/paginantion-response.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment)
    private paymentModel: typeof Payment,
    private updatePaymentStrategy: UpdatePaymentStrategy,
    private createPaymentStrategy: CreatePaymentStrategy,
    private findPaymentStrategy: FindPaymentStrategy,
    private invoiceService: InvoicesService,
  ) {}

  async create(paymentInfo: CreatePaymentDto): Promise<Payment> {
    const createdPayment = await this.createPaymentStrategy.create(paymentInfo);
    if (createdPayment.status === PaymentStatus.COMPLETED) {
      const invoiceId = createdPayment.invoiceId;
      await this.invoiceService.updateInvoice(invoiceId, createdPayment);
    }
    return createdPayment;
  }

  async find(
    paymentInfo: QueryPaymentDto,
    pagination: Partial<PaginationDto>,
  ): Promise<PaginatedResponse<Payment>> {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    let payments: { count: number; rows: Payment[] };
    if (page && limit) {
      payments = await this.paymentModel.findAndCountAll({
        where: paymentInfo || {},
        offset: offset,
        limit: limit,
      });
    } else {
      payments = await this.paymentModel.findAndCountAll({
        where: paymentInfo || {},
      });
    }
    const paginationInfo: PaginationResponse = {
      currentPage: page && limit ? page : null,
      records: payments.count,
      totalPages: page && limit ? Math.ceil(payments.count / limit) : null,
      nextPage: page * limit < payments.count ? page + 1 : null,
      prevPage: (page - 1) * limit > 0 ? page - 1 : null,
    };

    const response: PaginatedResponse<Payment> = {
      pagination: paginationInfo,
      results: payments.rows,
    };
    return response;
  }

  async update(
    paymentID: string,
    updateInfo: UpdatePaymentDto,
  ): Promise<Payment> {
    if (Object.keys(updateInfo).length < 1) {
      throw new BadRequestException('Body is empty or invalid field names');
    }
    const updatedResponse = await this.updatePaymentStrategy.update(
      paymentID,
      updateInfo,
    );
    return updatedResponse;
  }
}
