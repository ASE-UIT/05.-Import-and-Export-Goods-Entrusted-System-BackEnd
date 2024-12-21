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
        id: 'c63ac205-276b-49b3-8f90-1d6f55a6ad72',
        totalPrice: 26,
        pickupDate: '2024-12-17T00:00:00.000Z',
        deliveryDate: '2024-12-17T00:00:00.000Z',
        quotationDate: '2024-12-17T00:00:00.000Z',
        expiredDate: '2024-12-17T00:00:00.000Z',
        status: 'DRAFT',
        freightId: '84af5052-2113-4755-b237-ef3369f16235',
        quoteReqId: '4a58857e-648d-418d-8c8a-6fa518a1778d',
        employeeId: '007627ca-efbb-44b5-9ddc-f69fe1ea0c65',
        userId: 'c2d477f6-a9df-4131-b6db-6fd05e7f0dd6',
        updatedAt: '2024-12-20T14:15:48.600Z',
        createdAt: '2024-12-20T14:15:48.600Z',
        servideIds: [
          '7bbd27af-4f54-4eae-bd10-f2a0cec249c9',
          '00aa3fb1-2da4-4189-930a-ca810acc77b4',
        ],
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
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({ name: 'employeeId', required: false, type: String })
  @ApiQuery({ name: 'quotationDate', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: QuotationStatus })
  // @ApiQuery({
  //   name: 'page',
  //   type: Number,
  //   required: false,
  //   description: 'Current page',
  // })
  // @ApiQuery({
  //   name: 'limit',
  //   type: Number,
  //   required: false,
  //   description: 'Total records per page',
  // })
  @UseGuards(RoleGuard)
  @Get()
  async findQuotation(
    @Query(new ZodValidationPipe(QueryQuotationSchema))
    query: QueryQuotationDto,
    // @Query(new ZodValidationPipe(PaginationSchema.partial()))
    // pagination: Partial<PaginationDto>,
  ) {
    const result = await this.quotationsService.findQuotations(
      query,
      //pagination,
    );
    return result;
    //return new SuccessResponse('Success', result);
  }

  //find quotation by id
  @ApiOperation({ summary: 'Retrieve quotation by id' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved quotation',
    example: {
      id: 'c3c8920e-8b8b-4d3d-9919-9eb0f4fb50ca',
      totalPrice: 26,
      pickupDate: '2024-12-17T00:00:00.000Z',
      deliveryDate: '2024-12-17T00:00:00.000Z',
      quotationDate: '2024-12-17T00:00:00.000Z',
      expiredDate: '2024-12-17T00:00:00.000Z',
      status: 'DRAFT',
      userId: 'c2d477f6-a9df-4131-b6db-6fd05e7f0dd6',
      quoteReqId: '4a58857e-648d-418d-8c8a-6fa518a1778d',
      freightId: '84af5052-2113-4755-b237-ef3369f16235',
      employeeId: null,
      createdAt: '2024-12-20T14:07:58.109Z',
      updatedAt: '2024-12-20T14:07:58.109Z',
      serviceIds: [
        '00aa3fb1-2da4-4189-930a-ca810acc77b4',
        '7bbd27af-4f54-4eae-bd10-f2a0cec249c9',
      ],
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
    description: 'Quotation successfully created',
    //type: createResponseType('Quotation successfully created', Quotation),
    example: {
      message: 'Quotation successfully created',
      data: {
        id: 'c63ac205-276b-49b3-8f90-1d6f55a6ad72',
        totalPrice: 26,
        pickupDate: '2024-12-17T00:00:00.000Z',
        deliveryDate: '2024-12-17T00:00:00.000Z',
        quotationDate: '2024-12-17T00:00:00.000Z',
        expiredDate: '2024-12-17T00:00:00.000Z',
        status: 'DRAFT',
        freightId: '84af5052-2113-4755-b237-ef3369f16235',
        quoteReqId: '4a58857e-648d-418d-8c8a-6fa518a1778d',
        employeeId: null,
        userId: 'c2d477f6-a9df-4131-b6db-6fd05e7f0dd6',
        updatedAt: '2024-12-20T14:15:48.600Z',
        createdAt: '2024-12-20T14:15:48.600Z',
        servideIds: [
          '7bbd27af-4f54-4eae-bd10-f2a0cec249c9',
          '00aa3fb1-2da4-4189-930a-ca810acc77b4',
        ],
      },
    },
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
      'Only users with the following roles can access this resource: ADMIN,SALES,MANAGER,CLIENT',
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
        userId: 'd330c83f-b7ff-4521-a132-b0b34ac0b7f3',
      },
    },
  })
  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.SALES, RoleEnum.MANAGER, RoleEnum.CLIENT])
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
    //type: createResponseType('Quotation successfully updated', Quotation),
    example: {
      message: 'Quotation updated successfully',
      data: {
        id: 'c63ac205-276b-49b3-8f90-1d6f55a6ad72',
        totalPrice: 26,
        pickupDate: '2024-12-17T00:00:00.000Z',
        deliveryDate: '2024-12-17T00:00:00.000Z',
        quotationDate: '2024-12-17T00:00:00.000Z',
        expiredDate: '2024-12-17T00:00:00.000Z',
        status: 'ACCEPTED',
        userId: 'c2d477f6-a9df-4131-b6db-6fd05e7f0dd6',
        quoteReqId: '4a58857e-648d-418d-8c8a-6fa518a1778d',
        freightId: '84af5052-2113-4755-b237-ef3369f16235',
        employeeId: null,
        createdAt: '2024-12-20T14:15:48.600Z',
        updatedAt: '2024-12-20T15:16:39.634Z',
        serviceIds: [
          '00aa3fb1-2da4-4189-930a-ca810acc77b4',
          '7bbd27af-4f54-4eae-bd10-f2a0cec249c9',
        ],
      },
    },
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
        quoteReqId: '1c26b2ca-a13c-40a7-9903-fa092e2ecb5c',
        pickupDate: '2023-04-20T12:00:00.000Z',
        deliveryDate: '2023-04-26T12:00:00.000Z',
        quotationDate: '2023-04-19T12:00:00.000Z',
        expiredDate: '2023-05-06T12:00:00.000Z',
        freightId: 'badf2914-b569-4b65-9bdb-a62ad8913d91',
        employeeId: 'a4233408-bd61-44e2-a953-257c48cfae57',
        userId: 'd330c83f-b7ff-4521-a132-b0b34ac0b7f3',
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
