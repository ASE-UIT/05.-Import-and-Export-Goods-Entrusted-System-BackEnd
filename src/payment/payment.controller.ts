import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
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
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';
import {
  CreatePaymentDto,
  CreatePaymentSchema,
  UpdatePaymentDto,
} from './dtos/create-payment.dto';
import { Payment } from './models/payment.model';
import { PaymentsService } from './payment.service';
import { QueryPaymentDto, QueryPaymentSchema } from './dtos/query-payment.dto';
import { FindPaymentStrategy } from './strategies/find-payment/find-payment-strategy.enum';
import { PaymentStatus } from '@/shared/enums/payment-status.enum';
import { RoleGuard } from '@/shared/guards/role.guard';
import { RoleEnum } from '@/shared/enums/roles.enum';
import { Roles } from '@/shared/decorators/role.decorator';
import { createResponseType } from '@/shared/helpers/create-response.mixi';
import { ValidationError } from '@/shared/classes/validation-error.class';
import { SuccessResponse } from '@/shared/classes/success-response.class';

@ApiTags('Payments')
@Controller({
  path: 'payments',
  version: '1',
})
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) { }

  @ApiOperation({ summary: 'Create new payment' })
  @ApiResponse({
    status: 201,
    description: 'Payment created',
    type: createResponseType('Payment created successfully', Payment),
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body',
    type: ValidationError,
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication is required to create a payment',
    type: UnauthorizedException,
    example: new UnauthorizedException(
      'Only authenticated users can access this resource',
    ).getResponse(),
  })
  @ApiResponse({
    status: 403,
    description:
      'Only user with role: [ADMIN | ACCOUNTANT] can perform this action',
    type: ForbiddenException,
    example: new ForbiddenException(
      'Only users with the following roles can access this resource: ADMIN, ACCOUNTANT',
    ).getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
    type: ForbiddenException,
    example: {
      NotFoundInvoice: {
        summary: 'The provided invoiceId does not exist',
        value: new NotFoundException("Invoice doesn't exist").getResponse(),
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    type: ValidationError,
  })
  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNTANT])
  @Post()
  async createPayment(
    @Body(new ZodValidationPipe(CreatePaymentSchema))
    body: CreatePaymentDto,
  ) {
    const createRes = await this.paymentsService.create(body);
    return new SuccessResponse('Payment created successfully', createRes);
  }

  @ApiOperation({ summary: 'Search for payments ' })
  @ApiQuery({
    name: 'id',
    type: String,
    required: false,
    description: 'Search payment by id',
  })
  @ApiQuery({
    name: 'amountPaid',
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
    name: 'invoiceId',
    type: String,
    required: false,
    description: 'Search payment by invoice id',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment found',
    type: Payment,
  })
  @ApiResponse({
    status: 400,
    description: 'Unrecognized key(s) in query',
  })
  @ApiResponse({
    status: 401,
    description: "Authentication is required to find payment's information",
    type: UnauthorizedException,
    example: new UnauthorizedException(
      'Only authenticated users can access this resource',
    ).getResponse(),
  })
  @ApiResponse({
    status: 403,
    description:
      'Only user with role: [ADMIN | ACCOUNTANT] can perform this action',
    type: ForbiddenException,
    example: new ForbiddenException(
      'Only users with the following roles can access this resource: ADMIN, ACCOUNTANT',
    ).getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'Payment not found',
    type: NotFoundException,
    example: new NotFoundException('Payment not found').getResponse(),
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    type: ValidationError,
  })
  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNTANT])
  @Get()
  async findPayment(
    @Query(new ZodValidationPipe(QueryPaymentSchema.strict()))
    query: QueryPaymentDto,
  ) {
    const foundRes = await this.paymentsService.find(query);
    return new SuccessResponse('Payment found', foundRes);
  }

  @ApiOperation({ summary: "Update payment's information" })
  @ApiBody({
    type: UpdatePaymentDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Payment updated',
    type: createResponseType('Payment updated successfully', Payment),
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body',
    type: ValidationError,
  })
  @ApiResponse({
    status: 401,
    description: "Authentication is required to update a payment's information",
    type: UnauthorizedException,
    example: new UnauthorizedException(
      'Only authenticated users can access this resource',
    ).getResponse(),
  })
  @ApiResponse({
    status: 403,
    description:
      'Only user with role: [ADMIN | ACCOUNTANT] can perform this action',
    type: ForbiddenException,
    example: new ForbiddenException(
      'Only users with the following roles can access this resource: ADMIN, ACCOUNTANT',
    ).getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'The provided payment information does not exist',
    type: NotFoundException,
    example: new NotFoundException('Payment not found').getResponse(),
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    type: ValidationError,
  })
  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNTANT])
  @Patch(':id')
  async updatePayment(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(CreatePaymentSchema.partial()))
    body: Partial<CreatePaymentDto>,
  ) {
    const updateRes = await this.paymentsService.update(id, body);
    return new SuccessResponse('Payment updated successfully', updateRes);
  }
}
