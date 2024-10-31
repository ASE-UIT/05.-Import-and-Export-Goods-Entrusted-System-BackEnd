import {
  BadRequestException,
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
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
import {
  CreateQuotationDto,
  CreateQuotationSchema,
  UpdateQuotationDto,
} from './dtos/CreateQuotationDto';
import {
  QueryQuotationDto,
  QueryQuotationSchema,
} from './dtos/QueryQuotationDto';
import { QuotationsService } from './quotations.service';
import { Quotation } from './models/quotations.model';
import { FindQuotationStrategy } from './strategies/find-quotation/find-quotation-strategy.enum';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from '@/shared/guards/role.guard';
import { Roles } from '@/shared/decorators/role.decorator';
import { RoleEnum } from '@/shared/enums/roles.enum';
import { QuotationStatus } from '@/shared/enums/quotation-status.enum';

@ApiTags('quotations')
@Controller({
  path: 'quotations',
  version: '1',
})
export class QuotationsController {
  constructor(private quotationsService: QuotationsService) { }

  //query quotation
  // @UseGuards(RoleGuard)
  // @Roles([
  //   RoleEnum.ADMIN,
  //   RoleEnum.SALES,
  //   RoleEnum.MANAGER,
  // ])
  @Get()
  @ApiOperation({ summary: 'Retrieve quotation based on query parameters' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved quotation' })
  @ApiResponse({ status: 401, description: 'Not logged in or account has unappropriate role' })
  @ApiResponse({ status: 404, description: 'No quotation found' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiQuery({ name: 'customerId', required: false, type: String })
  @ApiQuery({ name: 'employeeId', required: false, type: String })
  @ApiQuery({ name: 'quotationDate', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: QuotationStatus })
  async findQuotation(
    @Query(new ZodValidationPipe(QueryQuotationSchema))
    query: QueryQuotationDto,
  ): Promise<Quotation[]> {
    if (Object.keys(query).length === 0) {
      return this.quotationsService.find(FindQuotationStrategy.ALL, '');
    }
    const queryFields: { [key: string]: FindQuotationStrategy } = {
      deliveryDate: FindQuotationStrategy.DELIVERY_DATE,
      expiredDate: FindQuotationStrategy.EXPIRED_DATE,
      pickupDate: FindQuotationStrategy.PICKUP_DATE,
      quotationDate: FindQuotationStrategy.QUOTATION_DATE,
      status: FindQuotationStrategy.STATUS,
      totalPrice: FindQuotationStrategy.TOTAL_PRICE,
      employeeId: FindQuotationStrategy.EMPLOYEE_ID,
      customerId: FindQuotationStrategy.CUSTOMER_ID,
    };

    for (const [key, strategy] of Object.entries(queryFields)) {
      const value = query[key as keyof QueryQuotationDto];
      if (value) {
        const quotation = await this.quotationsService.find(strategy, value);

        if (quotation.length > 0) {
          if (strategy === FindQuotationStrategy.ALL || quotation.length > 1)
            return quotation;
          else return [quotation[0]];
        }
      }
    }

    throw new NotFoundException('Quotation not found');
  }

  //create quotation
  // @UseGuards(RoleGuard)
  // @Roles([
  //   RoleEnum.ADMIN,
  //   RoleEnum.SALES,
  //   RoleEnum.MANAGER,
  // ])
  @Post()
  @ApiOperation({ summary: 'Create a new quotation' })
  @ApiResponse({ status: 201, description: 'Quote request successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid foreign key.' })
  @ApiResponse({ status: 401, description: 'Not logged in or account has unappropriate role' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiBody({
    type: CreateQuotationDto,
    schema: {
      example: {
        quoteReqId: "1c26b2ca-a13c-40a7-9903-fa092e2ecb5c",
        pickupDate: "2023-04-20T12:00:00.000Z",
        deliveryDate: "2023-04-26T12:00:00.000Z",
        quotationDate: "2023-04-19T12:00:00.000Z",
        expiredDate: "2023-05-06T12:00:00.000Z",
        freightId: "badf2914-b569-4b65-9bdb-a62ad8913d91",
        status: "DRAFT",
        employeeId: "a4233408-bd61-44e2-a953-257c48cfae57"
      },
    },
  })
  async createQuotation(
    @Body(new ZodValidationPipe(CreateQuotationSchema))
    body: CreateQuotationDto,
  ): Promise<{ message: string; data: Quotation }> {
    const quotation = await this.quotationsService.create(body);
    return { message: 'Quotation successfully created', data: quotation };
  }


  //update quotation  
  // @UseGuards(RoleGuard)
  // @Roles([
  //   RoleEnum.ADMIN,
  //   RoleEnum.SALES,
  //   RoleEnum.MANAGER,
  // ])
  @Patch(':id')
  @ApiOperation({ summary: 'Update Quotation' })
  @ApiResponse({ status: 200, description: 'Quotation successfully updated' })
  @ApiResponse({ status: 401, description: 'Not logged in or account has unappropriate role' })
  @ApiResponse({ status: 400, description: 'Invalid foreign key.' })
  @ApiResponse({ status: 404, description: "Quotation id does not exists in database" })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
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
  async updateQuotation(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(CreateQuotationSchema.partial()))
    body: Partial<CreateQuotationDto>,
  ): Promise<{ message: string; data: Quotation }> {
    const quotation = await this.quotationsService.update(id, body);
    return { message: 'Quotation updated successfully', data: quotation };
  }
}
