import { BadRequestException, Body, Controller, ForbiddenException, Get, NotFoundException, Param, Patch, Post, Put, Query, UnauthorizedException, UseGuards } from '@nestjs/common';
import { QuotationReqsService } from './quotation-requests.service';
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
import { QueryQuotationReqDto, QueryQuotationReqSchema } from './dtos/QueryQuotationReqDto';
import { CreateQuotationReqDto, CreateQuotationReqSchema, UpdateQuotationReqDto } from './dtos/CreateQuotationReqDto';
import { FindQuotationReqStrategy } from './strategies/find-quotationReq/find-quotationReq-strategy.enum';
import { QuotationReq, QuotationReqStatus } from './models/quotationReq.model';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { RoleGuard } from '@/shared/guards/role.guard';
import { RoleEnum } from '@/shared/enums/roles.enum';
import { Roles } from '@/shared/decorators/role.decorator';
import { createResponseType } from '@/shared/helpers/create-response.mixin';

@ApiTags('quote requests')
@Controller({
  path: 'quotation-requests',
  version: '1',
})
export class QuotationReqsController {
  constructor(private readonly quotationReqsService: QuotationReqsService) { }

  @ApiOperation({ summary: 'Retrieve quote requests based on query parameters' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved quote requests',
    type: QuotationReq,
    example: {
      "id": "f1a5d699-5168-439c-8d24-1b01bd3022de",
      "requestDate": "2024-10-23T00:00:00.000Z",
      "status": "PENDING",
      "customerId": "d476badd-cd71-41be-9544-073b9f44a729",
      "createdAt": "2024-10-31T03:07:03.407Z",
      "updatedAt": "2024-10-31T03:07:03.407Z"
    }
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
    description: 'No quote requests found',
    type: NotFoundException,
    example: new NotFoundException('No quote request found').getResponse()
  })
  @ApiQuery({ name: 'requestDate', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: QuotationReqStatus })
  @ApiQuery({ name: 'customerId', required: false, type: String })
  @UseGuards(RoleGuard)
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
  @ApiResponse({
    status: 201,
    description: 'Quote request successfully created',
    type: createResponseType('Quote request successfully created', QuotationReq)
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid foreign key.',
    type: BadRequestException,
    example: new BadRequestException(
      'Invalid foreign key'
    ).getResponse()
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
  @ApiResponse({
    status: 200,
    description: 'Quote request successfully updated',
    type: createResponseType('Quote request successfully updated', QuotationReq)
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid foreign key.',
    type: BadRequestException,
    example: new BadRequestException(
      'Invalid foreign key'
    ).getResponse()
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
    description: "Quote request id does not exists in database",
    type: NotFoundException,
    example: new NotFoundException('Quote request id does not exists in database').getResponse()
  })
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
