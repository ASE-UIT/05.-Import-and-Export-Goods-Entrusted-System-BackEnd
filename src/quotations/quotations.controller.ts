import {
  BadRequestException,
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
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
import {
  CreateQuotationDto,
  CreateQuotationSchema,
} from './dtos/CreateQuotationDto';
import {
  QueryQuotationDto,
  QueryQuotationSchema,
} from './dtos/QueryQuotationDto';
import { QuotationsService } from './quotations.service';
import { Quotation } from './models/quotations.model';
import { FindQuotationStrategy } from './strategies/find-quotation/find-quotation-strategy.enum';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RoleGuard } from '@/shared/guards/role.guard';
import { Roles } from '@/shared/decorators/role.decorator';
import { RoleEnum } from '@/shared/enums/roles.enum';
import { QuotationStatus } from '@/shared/enums/quotation-status.enum';
import { ValidationError } from '@/shared/classes/validation-error.class';
import { createResponseType } from '@/shared/helpers/create-response.mixin';
import {
  UpdateQuotationDto,
  UpdateQuotationSchema,
} from './dtos/UpdateQuotationDto';
import { PaginationDto, PaginationSchema } from '@/shared/dto/pagination.dto';
import { SuccessResponse } from '@/shared/classes/success-response.class';
import { use } from 'passport';

@ApiTags('quotations')
@Controller({
  path: 'quotations',
  version: '1',
})
export class QuotationsController {
  constructor(private quotationsService: QuotationsService) {}

  //query quotation
  @ApiOperation({ summary: 'Retrieve quotation based on query parameters' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved quotation',
    example: [
      {
        id: '9f79b1dc-f14e-440e-9ede-31592079c80a',
        totalPrice: 4.5,
        pickupDate: '2023-04-20T12:00:00.000Z',
        deliveryDate: '2023-04-26T12:00:00.000Z',
        quotationDate: '2023-04-19T12:00:00.000Z',
        expiredDate: '2023-05-06T12:00:00.000Z',
        status: 'DRAFT',
        quoteReqId: 'f1a5d699-5168-439c-8d24-1b01bd3022de',
        freightId: '0893855a-adb7-45a1-9ad7-65dce8cc0e6a',
        employeeId: 'c67d645e-68b3-4a41-81ff-eeea41e8b663',
        createdAt: '2024-10-31T13:38:05.867Z',
        updatedAt: '2024-10-31T13:38:05.867Z',
      },
    ],
  })
  @ApiResponse({
    status: 401,
    description: 'Only authenticated users can access this resource',
    type: UnauthorizedException,
    example: new UnauthorizedException(
      'Only authenticated users can access this resource',
    ).getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'No quotation found',
    type: NotFoundException,
    example: new NotFoundException('No quotation found').getResponse(),
  })
  @ApiQuery({ name: 'customerId', required: false, type: String })
  @ApiQuery({ name: 'employeeId', required: false, type: String })
  @ApiQuery({ name: 'quotationDate', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: QuotationStatus })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Current page',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Total records per page',
  })
  @UseGuards(RoleGuard)
  @Get()
  async findQuotation(
    @Query(new ZodValidationPipe(QueryQuotationSchema))
    query: QueryQuotationDto,
    @Query(new ZodValidationPipe(PaginationSchema.partial()))
    pagination: Partial<PaginationDto>,
  ) {
    const result = await this.quotationsService.findQuotations(
      query,
      pagination,
    );
    return new SuccessResponse('Success', result);
  }

  //find quotation by id
  @ApiOperation({ summary: 'Retrieve quotation by id' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved quotation',
    example: {
      id: '9f79b1dc-f14e-440e-9ede-31592079c80a',
      totalPrice: 4.5,
      pickupDate: '2023-04-20T12:00:00.000Z',
      deliveryDate: '2023-04-26T12:00:00.000Z',
      quotationDate: '2023-04-19T12:00:00.000Z',
      expiredDate: '2023-05-06T12:00:00.000Z',
      status: 'DRAFT',
      quoteReqId: 'f1a5d699-5168-439c-8d24-1b01bd3022de',
      freightId: '0893855a-adb7-45a1-9ad7-65dce8cc0e6a',
      employeeId: 'c67d645e-68b3-4a41-81ff-eeea41e8b663',
      createdAt: '2024-10-31T13:38:05.867Z',
      updatedAt: '2024-10-31T13:38:05.867Z',
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Only authenticated users can access this resource',
    type: UnauthorizedException,
    example: new UnauthorizedException(
      'Only authenticated users can access this resource',
    ).getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'Quotation not found',
    type: NotFoundException,
    example: new NotFoundException('Quotation not found').getResponse(),
  })
  @UseGuards(RoleGuard)
  @Get(':id')
  async findQuotationById(@Param('id') id: string): Promise<Quotation> {
    return await this.quotationsService.findQuotationById(id);
  }

  //create quotation
  @ApiOperation({ summary: 'Create a new quotation' })
  @ApiResponse({
    status: 201,
    description: 'Quote request successfully created',
    type: createResponseType('Quote request successfully created', Quotation),
    example: createResponseType(
      'Quote request successfully created',
      Quotation,
    ),
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid foreign key.',
    type: BadRequestException,
    example: new BadRequestException('Invalid foreign key').getResponse(),
  })
  @ApiResponse({
    status: 401,
    description: 'Only authenticated users can access this resource',
    type: UnauthorizedException,
    example: new UnauthorizedException(
      'Only authenticated users can access this resource',
    ).getResponse(),
  })
  @ApiResponse({
    status: 403,
    description: 'Only the following roles can create users',
    type: ForbiddenException,
    example: new ForbiddenException(
      'Only users with the following roles can access this resource: ADMIN,SALES,MANAGER',
    ).getResponse(),
  })
  @ApiBody({
    type: CreateQuotationDto,
    schema: {
      example: {
        quoteReqId: '1c26b2ca-a13c-40a7-9903-fa092e2ecb5c',
        pickupDate: '2023-04-20T12:00:00.000Z',
        deliveryDate: '2023-04-26T12:00:00.000Z',
        quotationDate: '2023-04-19T12:00:00.000Z',
        expiredDate: '2023-05-06T12:00:00.000Z',
        freightId: 'badf2914-b569-4b65-9bdb-a62ad8913d91',
        employeeId: 'a4233408-bd61-44e2-a953-257c48cfae57',
      },
    },
  })
  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.SALES, RoleEnum.MANAGER])
  @Post()
  async createQuotation(
    @Body(new ZodValidationPipe(CreateQuotationSchema))
    body: CreateQuotationDto,
  ): Promise<{ message: string; data: Quotation }> {
    const quotation = await this.quotationsService.create(body);
    return { message: 'Quotation successfully created', data: quotation };
  }

  //update quotation
  @ApiOperation({ summary: 'Update Quotation' })
  @ApiResponse({
    status: 200,
    description: 'Quotation successfully updated',
    type: createResponseType('Quotation successfully updated', Quotation),
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid foreign key.',
    type: ValidationError,
  })
  @ApiResponse({
    status: 401,
    description: 'Only authenticated users can access this resource',
    type: UnauthorizedException,
    example: new UnauthorizedException(
      'Only authenticated users can access this resource',
    ).getResponse(),
  })
  @ApiResponse({
    status: 403,
    description: 'Only the following roles can create users',
    type: ForbiddenException,
    example: new ForbiddenException(
      'Only users with the following roles can access this resource: ADMIN,SALES,MANAGER',
    ).getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'Quotation id does not exists in database',
    type: NotFoundException,
    example: new NotFoundException(
      'Quotation id does not exists in database',
    ).getResponse(),
  })
  @ApiBody({
    type: UpdateQuotationDto,
    schema: {
      example: {
        requestDate: '2024-01-01T00:00:00.000Z',
        status: 'PENDING',
        customerId: '9b16a980-076c-4700-9c48-e9fccbe24766',
      },
    },
  })
  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.SALES, RoleEnum.MANAGER])
  @Patch(':id')
  async updateQuotation(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateQuotationSchema))
    body: Partial<UpdateQuotationDto>,
  ): Promise<{ message: string; data: Quotation }> {
    const quotation = await this.quotationsService.update(id, body);
    return { message: 'Quotation updated successfully', data: quotation };
  }
}
