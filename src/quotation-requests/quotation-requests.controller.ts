import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { QuotationReqsService } from './quotation-request.service';
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
import { QueryQuotationReqDto, QueryQuotationReqSchema } from './dtos/QueryQuotationReqDto';
import { CreateQuotationReqDto, CreateQuotationReqSchema, UpdateQuotationReqDto } from './dtos/CreateQuotationReqDto';
import { FindQuotationReqStrategy } from './strategies/find-quotationReq/find-quotationReq-strategy.enum';
import { QuotationReq, QuotationReqStatus } from './models/quotationReq.model';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { RoleGuard } from '@/shared/guards/role.guard';
import { RoleEnum } from '@/shared/enums/roles.enum';
import { Roles } from '@/shared/decorators/role.decorator';

@ApiTags('quote requests')
@Controller({
  path: 'quotation-requests',
  version: '1',
})
export class QuotationReqsController {
  constructor(private readonly quotationReqsService: QuotationReqsService) { }

  @ApiOperation({ summary: 'Retrieve quote requests based on query parameters' })
  @ApiResponse({ status: 401, description: 'Not logged in or account has unappropriate role' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved quote requests' })
  @ApiResponse({ status: 404, description: 'No quote requests found' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiQuery({ name: 'requestDate', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: QuotationReqStatus })
  @ApiQuery({ name: 'customerId', required: false, type: String })
  @UseGuards(RoleGuard)
  @Roles([
    RoleEnum.ADMIN,
    RoleEnum.SALES,
    RoleEnum.MANAGER,
  ])
  @Get()
  async getQuotationReqs(
    @Query(new ZodValidationPipe(QueryQuotationReqSchema)) query: QueryQuotationReqDto,
  ) {
    if (Object.keys(query).length === 0)
      return await this.quotationReqsService.findQuotationReq(
        FindQuotationReqStrategy.ALL,
        '',
      );

    // Get query fields
    const queryFields: { [key: string]: FindQuotationReqStrategy } = {
      requestDate: FindQuotationReqStrategy.REQUESTDATE,
      status: FindQuotationReqStrategy.STATUS,
      customerId: FindQuotationReqStrategy.CUSTOMERID
    }

    // Assign corrisponding strategy to query fields
    for (const [key, strategy] of Object.entries(queryFields)) {
      const value = query[key as keyof QueryQuotationReqDto];
      if (value) {
        const quotationReq = await this.quotationReqsService.findQuotationReq(
          strategy,
          value,
        );
        if (quotationReq.length > 0) {
          if (strategy === FindQuotationReqStrategy.ALL || quotationReq.length > 1)
            return quotationReq;
          else return quotationReq[0];
        }
      }
    }
    throw new NotFoundException('Quotate Request not found')
  }

  //create quotation request
  @ApiOperation({ summary: 'Create a new quote request' })
  @ApiResponse({ status: 201, description: 'Quote request successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid foreign key.' })
  @ApiResponse({ status: 401, description: 'Not logged in or account has unappropriate role' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiBody({
    type: CreateQuotationReqDto,
    schema: {
      example: {
        requestDate: '2024-01-01T00:00:00.000Z',
        status: 'PENDING',
        customerId: '9b16a980-076c-4700-9c48-e9fccbe24766',
      },
    },
  })
  @UseGuards(RoleGuard)
  @Roles([
    RoleEnum.ADMIN,
    RoleEnum.SALES,
    RoleEnum.MANAGER,
  ])
  @Post()
  async createQuotationReq(
    @Body(new ZodValidationPipe(CreateQuotationReqSchema)) body: CreateQuotationReqDto
  ) {
    const quoteReq = await this.quotationReqsService.createQuotationReq(body)
    return { message: 'Quote request successfully created', data: quoteReq }
  }


  //update quotation request

  @ApiOperation({ summary: 'Update quote request' })
  @ApiResponse({ status: 200, description: 'Quote request successfully updated' })
  @ApiResponse({ status: 401, description: 'Not logged in or account has unappropriate role' })
  @ApiResponse({ status: 404, description: "Quote request id does not exists in database" })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiBody({
    type: UpdateQuotationReqDto,
    schema: {
      example: {
        requestDate: '2024-01-01T00:00:00.000Z',
        status: 'PENDING',
        customerId: '9b16a980-076c-4700-9c48-e9fccbe24766',
      },
    },
  })
  @UseGuards(RoleGuard)
  @Roles([
    RoleEnum.ADMIN,
    RoleEnum.SALES,
    RoleEnum.MANAGER,
  ])
  @Patch(':id')
  async updateQuotationReq(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(CreateQuotationReqSchema.partial())) body: Partial<CreateQuotationReqDto>
  ) {
    //check if body is empty 
    if (Object.keys(body).length === 0) {
      throw new BadRequestException('Body cannot be empty')
    }
    return await this.quotationReqsService.updateQuotationReq(id, body)
  }
}
