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
        id: '77f51f99-f397-47c8-a155-e5aef56b8f30',
        totalPrice: 0,
        pickupDate: '2024-12-15T00:00:00.000Z',
        deliveryDate: '2024-12-15T00:00:00.000Z',
        quotationDate: '2024-12-15T00:00:00.000Z',
        expiredDate: '2024-12-15T00:00:00.000Z',
        status: 'DRAFT',
        userId: 'e3c284c2-9a28-4d7d-b87d-02952bf928a1',
        quoteReqId: '8a58a7dd-be52-4461-894d-c03c114174c8',
        freightId: '7328988a-9fbd-4b63-b7ae-93cbd22c9832',
        employeeId: '37bdab2b-1322-4b4c-ba72-61f54fd70678',
        createdAt: '2024-12-14T15:29:22.960Z',
        updatedAt: '2024-12-14T15:29:22.960Z',
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
      id: '77f51f99-f397-47c8-a155-e5aef56b8f30',
      totalPrice: 0,
      pickupDate: '2024-12-15T00:00:00.000Z',
      deliveryDate: '2024-12-15T00:00:00.000Z',
      quotationDate: '2024-12-15T00:00:00.000Z',
      expiredDate: '2024-12-15T00:00:00.000Z',
      status: 'DRAFT',
      userId: 'e3c284c2-9a28-4d7d-b87d-02952bf928a1',
      quoteReqId: '8a58a7dd-be52-4461-894d-c03c114174c8',
      freightId: '7328988a-9fbd-4b63-b7ae-93cbd22c9832',
      employeeId: '317331e8-463f-4929-9798-d55e3ae91fc8',
      createdAt: '2024-12-14T15:29:22.960Z',
      updatedAt: '2024-12-14T15:37:09.850Z',
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
    type: createResponseType('Quotation successfully created', Quotation),
    example: createResponseType('Quotation successfully created', Quotation),
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
