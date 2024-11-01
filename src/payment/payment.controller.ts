import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';
import {
  CreatePaymentDto,
  CreatePaymentSchema,
  UpdatePaymentDto,
} from './dtos/CreatePaymentDto';
import { Payment } from './models/payment.model';
import { PaymentsService } from './payment.service';
import { QueryPaymentDto, QueryPaymentSchema } from './dtos/QueryPaymentDto';
import { FindPaymentStrategy } from './strategies/find-payment/find-payment-strategy.enum';
import { PaymentStatus } from '@/shared/enums/payment-status.enum';
import { RoleGuard } from '@/shared/guards/role.guard';
import { RoleEnum } from '@/shared/enums/roles.enum';
import { Roles } from '@/shared/decorators/role.decorator';

@ApiTags('Payments')
@Controller({
  path: 'payments',
  version: '1',
})
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  //@UseGuards(RoleGuard)
  //@Roles([RoleEnum.ADMIN, RoleEnum.ACCOUTANT])
  @ApiOperation({ summary: 'Create new payment' })
  @ApiBody({
    type: CreatePaymentDto,
  })
  @ApiCreatedResponse({ description: 'New payment created' })
  @ApiBadRequestResponse({ description: 'Invalid body' })
  @ApiUnauthorizedResponse({
    description: 'Not logged in or account has unappropriate role',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong. Contact backend team at once',
  })
  @Post()
  async createPayment(
    @Body(new ZodValidationPipe(CreatePaymentSchema))
    body: CreatePaymentDto,
  ): Promise<{ message: string; data: Payment }> {
    const createRes = await this.paymentsService.create(body);
    return { message: 'Payment created successfully', data: createRes };
  }

  //@UseGuards(RoleGuard)
  //@Roles([RoleEnum.ADMIN, RoleEnum.ACCOUTANT])
  @ApiOperation({ summary: 'Search for payments ' })
  @ApiQuery({
    name: 'id',
    type: String,
    required: false,
    description: 'Search payment by id',
  })
  @ApiQuery({
    name: 'amount paid',
    type: Number,
    required: false,
    description: 'Search payment by amount paid',
  })
  @ApiQuery({
    name: 'status',
    enum: PaymentStatus,
    required: false,
    description: 'Search payment by status',
  })
  @ApiQuery({
    name: 'invoice id',
    type: String,
    required: false,
    description: 'Search payment by invoice id',
  })
  @ApiOkResponse({ description: 'payment found' })
  @ApiNotFoundResponse({ description: 'payment not found' })
  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong. Contact backend team at once',
  })
  @ApiUnauthorizedResponse({
    description: 'Not logged in or account has unappropriate role',
  })
  @Get()
  async findPayment(
    @Query(new ZodValidationPipe(QueryPaymentSchema))
    query: QueryPaymentDto,
  ): Promise<Payment[]> {
    if (Object.keys(query).length === 0) {
      return this.paymentsService.find(FindPaymentStrategy.ALL, '');
    }

    const queryFields: { [key: string]: FindPaymentStrategy } = {
      id: FindPaymentStrategy.ID,
      amountPaid: FindPaymentStrategy.AMOUNT_PAID,
      status: FindPaymentStrategy.STATUS,
      invoiceId: FindPaymentStrategy.INVOICE_ID,
    };

    for (const [key, strategy] of Object.entries(queryFields)) {
      const value = query[key as keyof QueryPaymentDto];
      if (value) {
        const payment = await this.paymentsService.find(strategy, value);

        if (payment.length > 0) {
          if (strategy === FindPaymentStrategy.ALL || payment.length > 1)
            return payment;
          else return [payment[0]];
        }
      }
    }

    throw new NotFoundException('Payment not found');
  }

  //@UseGuards(RoleGuard)
  //@Roles([RoleEnum.ADMIN, RoleEnum.ACCOUTANT])
  @ApiOperation({ summary: "Update payment's information" })
  @ApiOkResponse({ description: 'New information updated' })
  @ApiBadRequestResponse({ description: 'Empty body or misspelled property' })
  @ApiNotFoundResponse({ description: 'Could not find payment to update' })
  @ApiUnauthorizedResponse({
    description: 'Not logged in or account has unappropriate role',
  })
  @ApiBody({
    type: UpdatePaymentDto,
    examples: {
      example: {
        description: 'Able to update one or more fields in CreatePaymentDto',
        value: {
          amountPaid: 200,
          status: 'FAILED',
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong. Contact backend team at once',
  })
  @Patch(':id')
  async updatePayment(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(CreatePaymentSchema.partial()))
    body: Partial<CreatePaymentDto>,
  ): Promise<{ message: string; data: Payment }> {
    const updateRes = await this.paymentsService.update(id, body);
    return { message: 'Payment updated successfully', data: updateRes };
  }
}
