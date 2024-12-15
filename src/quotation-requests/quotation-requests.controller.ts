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
import { QuotationReqsService } from './quotation-requests.service';
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
import {
  QueryQuotationReqDto,
  QueryQuotationReqSchema,
} from './dtos/QueryQuotationReqDto';
import {
  CreateQuotationReqDto,
  CreateQuotationReqSchema,
} from './dtos/CreateQuotationReqDto';
import { FindQuotationReqStrategy } from './strategies/find-quotationReq/find-quotationReq-strategy.enum';
import { QuotationReq, QuotationReqStatus } from './models/quotationReq.model';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RoleGuard } from '@/shared/guards/role.guard';
import { RoleEnum } from '@/shared/enums/roles.enum';
import { Roles } from '@/shared/decorators/role.decorator';
import { createResponseType } from '@/shared/helpers/create-response.mixin';
import {
  UpdateQuotationReqDto,
  UpdateQuotationReqSchema,
} from './dtos/UpdateQuotationReqDto';
import {
  CreateQuoteReqWithDetailSchema,
  CreateQuoteReqWithDetailDto,
} from './dtos/CreateQuoteReqWithDetail';
import {
  UpdateQuoteReqWithDetailDto,
  UpdateQuoteReqWithDetailSchema,
} from './dtos/UpdateQuotationReqWithDetail';
import { PaginationDto, PaginationSchema } from '@/shared/dto/pagination.dto';
import { SuccessResponse } from '@/shared/classes/success-response.class';

@ApiTags('quote requests')
@Controller({
  path: 'quotation-requests',
  version: '1',
})
export class QuotationReqsController {
  constructor(private readonly quotationReqsService: QuotationReqsService) {}

  @ApiOperation({
    summary: 'Retrieve quote requests based on query parameters',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved quote requests',
    type: QuotationReq,
    example: [
      {
        id: 'f1a5d699-5168-439c-8d24-1b01bd3022de',
        requestDate: '2024-10-23T00:00:00.000Z',
        status: 'PENDING',
        userId: 'd476badd-cd71-41be-9544-073b9f44a729',
        createdAt: '2024-10-31T03:07:03.407Z',
        updatedAt: '2024-10-31T03:07:03.407Z',
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
    description: 'No quote requests found',
    type: NotFoundException,
    example: new NotFoundException('No quote request found').getResponse(),
  })
  @ApiQuery({ name: 'requestDate', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: QuotationReqStatus })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @UseGuards(RoleGuard)
  @Get()
  async getQuotationReqs(
    @Query(new ZodValidationPipe(QueryQuotationReqSchema))
    query: QueryQuotationReqDto,
    // @Query(new ZodValidationPipe(PaginationSchema.partial()))
    // pagination: Partial<PaginationDto>,
  ) {
    const result = await this.quotationReqsService.getQuoteRequests(
      query,
      //pagination,
    );
    //return new SuccessResponse('Success', result);
    return result;
  }

  //create quotation request
  @ApiOperation({ summary: 'Create a new quote request' })
  @ApiResponse({
    status: 201,
    description: 'Quote request successfully created',
    type: createResponseType(
      'Quote request successfully created',
      QuotationReq,
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
      'Only users with the following roles can access this resource: ADMIN,SALES,MANAGER,CLIENT',
    ).getResponse(),
  })
  @ApiBody({
    type: CreateQuotationReqDto,
    schema: {
      example: {
        requestDate: '2024-01-01T00:00:00.000Z',
        userId: '9b16a980-076c-4700-9c48-e9fccbe24766',
      },
    },
  })
  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.SALES, RoleEnum.MANAGER, RoleEnum.CLIENT])
  @Post()
  async createQuotationReq(
    @Body(new ZodValidationPipe(CreateQuotationReqSchema))
    body: CreateQuotationReqDto,
  ) {
    const quoteReq = await this.quotationReqsService.createQuotationReq(body);
    return { message: 'Quote request successfully created', data: quoteReq };
  }

  //update quotation request

  @ApiOperation({ summary: 'Update quote request' })
  @ApiResponse({
    status: 200,
    description: 'Quote request successfully updated',
    type: createResponseType(
      'Quote request successfully updated',
      QuotationReq,
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
  @ApiResponse({
    status: 404,
    description: 'Quote request id does not exists in database',
    type: NotFoundException,
    example: new NotFoundException(
      'Quote request id does not exists in database',
    ).getResponse(),
  })
  @ApiBody({
    type: UpdateQuotationReqDto,
    schema: {
      example: {
        requestDate: '2024-01-01T00:00:00.000Z',
        status: 'PENDING',
        userId: '9b16a980-076c-4700-9c48-e9fccbe24766',
      },
    },
  })
  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.SALES, RoleEnum.MANAGER])
  @Patch(':id')
  async updateQuotationReq(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateQuotationReqSchema.partial()))
    body: Partial<UpdateQuotationReqDto>,
  ) {
    //check if body is empty
    if (Object.keys(body).length === 0) {
      throw new BadRequestException('Body cannot be empty');
    }
    return await this.quotationReqsService.updateQuotationReq(id, body);
  }

  //get quote request with details

  @ApiOperation({
    summary: 'Retrieve quote requests with its associated details',
  })
  @ApiResponse({
    status: 200,
    description:
      'Successfully retrieved quote request with its associated details',
    schema: {
      example: {
        id: 'e1b71029-1799-44e6-8208-90ba23275658',
        requestDate: '2022-04-26T00:00:00.000Z',
        status: 'COMPLETED',
        userId: '1e449385-bc44-4010-a81b-f416a71b7432',
        createdAt: '2024-11-29T04:07:54.197Z',
        updatedAt: '2024-11-29T04:23:48.829Z',
        quoteReqDetails: {
          id: '5b97008d-c6fb-4f1c-b4eb-12ccc5c99ae5',
          origin: 'Peso',
          destination: 'Sepo',
          shipmentReadyDate: '2023-04-27T00:00:00.000Z',
          shipmentDeadline: '2023-04-28T00:00:00.000Z',
          cargoInsurance: true,
          shipmentType: 'AIR',
          quoteReqId: 'e1b71029-1799-44e6-8208-90ba23275658',
          createdAt: '2024-11-29T04:07:54.199Z',
          updatedAt: '2024-11-29T04:23:15.110Z',
          packageDetails: {
            id: '3b336caf-7ca8-4874-99d6-3eee7bc6cf9f',
            packageType: 'DRY',
            weight: 2,
            length: 5,
            width: 6,
            height: 7,
            detailId: '5b97008d-c6fb-4f1c-b4eb-12ccc5c99ae5',
            createdAt: '2024-11-29T04:07:54.201Z',
            updatedAt: '2024-11-29T04:07:54.201Z',
          },
        },
      },
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
    description: 'Quote request id does not exists in database',
    type: NotFoundException,
    example: new NotFoundException(
      'Quote request id does not exists in database',
    ).getResponse(),
  })
  @UseGuards(RoleGuard)
  @Get('with-details/:id')
  async getDetailQuoteRequestWithDetails(@Param('id') id: string) {
    return await this.quotationReqsService.getQuoteRequestWithDetailsById(id);
  }

  //create quotation request with details
  @ApiOperation({
    summary:
      'Create a new quote request with quote request detail and package detail',
  })
  @ApiResponse({
    status: 201,
    description:
      'Quote request successfully created with its associated details',
    schema: {
      example: {
        message:
          'Quote request successfully created with its associated details',
        data: {
          quoteRequest: {
            id: 'b2268d2f-ab44-4d09-98a1-d3a377eb72ac',
            requestDate: '2022-04-26T00:00:00.000Z',
            status: 'PENDING',
            userId: 'de0f1618-596c-44fa-b00b-a44c9ed6fe3a',
            updatedAt: '2024-11-16T14:13:43.580Z',
            createdAt: '2024-11-16T14:13:43.580Z',
          },
          quoteRequestDetail: {
            id: '6b5b4622-97d2-4c7a-9416-2c4be53a9529',
            origin: 'Peso',
            destination: 'Sepo',
            shipmentReadyDate: '2023-04-27T00:00:00.000Z',
            shipmentDeadline: '2023-04-28T00:00:00.000Z',
            cargoInsurance: true,
            quoteReqId: 'b2268d2f-ab44-4d09-98a1-d3a377eb72ac',
            updatedAt: '2024-11-16T14:13:43.590Z',
            createdAt: '2024-11-16T14:13:43.590Z',
          },
          packageDetail: {
            id: '82da928b-cd4a-4cd4-a9aa-a4793421fecf',
            packageType: 'DRY',
            weight: 2,
            length: 5,
            width: 6,
            height: 7,
            detailId: '6b5b4622-97d2-4c7a-9416-2c4be53a9529',
            updatedAt: '2024-11-16T14:13:43.593Z',
            createdAt: '2024-11-16T14:13:43.593Z',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Customer not found.',
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
    type: CreateQuoteReqWithDetailDto,
    schema: {
      example: {
        requestDate: '2022-04-26T00:00:00.000Z',
        userId: 'de0f1618-596c-44fa-b00b-a44c9ed6fe3a',
        origin: 'Peso',
        destination: 'Sepo',
        shipmentReadyDate: '2023-04-27T00:00:00.000Z',
        shipmentDeadline: '2023-04-28T00:00:00.000Z',
        cargoInsurance: true,
        packageType: 'DRY',
        weight: 2,
        length: 5,
        width: 6,
        height: 7,
      },
    },
  })
  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.SALES, RoleEnum.MANAGER, RoleEnum.CLIENT])
  @Post('with-details')
  async createQuoteRequest(
    @Body(new ZodValidationPipe(CreateQuoteReqWithDetailSchema))
    data: CreateQuoteReqWithDetailDto,
  ) {
    const result =
      await this.quotationReqsService.createQuoteRequestWithDetails(data);
    return {
      message: 'Quote request successfully created with its associated details',
      data: result,
    };
  }

  // Update quote request with details
  @ApiOperation({ summary: 'Update quote request with its associated details' })
  @ApiResponse({
    status: 200,
    description:
      'Quote request successfully updated with its associated details',
    schema: {
      example: {
        message:
          'Quote request successfully updated with its associated details',
        data: {
          quoteRequest: {
            id: 'e1b71029-1799-44e6-8208-90ba23275658',
            requestDate: '2022-04-26T00:00:00.000Z',
            status: 'COMPLETED',
            userId: '1e449385-bc44-4010-a81b-f416a71b7432',
            createdAt: '2024-11-29T04:07:54.197Z',
            updatedAt: '2024-11-29T04:23:48.829Z',
          },
          quoteRequestDetail: {
            id: '5b97008d-c6fb-4f1c-b4eb-12ccc5c99ae5',
            origin: 'Peso',
            destination: 'Sepo',
            shipmentReadyDate: '2023-04-27T00:00:00.000Z',
            shipmentDeadline: '2023-04-28T00:00:00.000Z',
            cargoInsurance: true,
            shipmentType: 'AIR',
            quoteReqId: 'e1b71029-1799-44e6-8208-90ba23275658',
            createdAt: '2024-11-29T04:07:54.199Z',
            updatedAt: '2024-11-29T04:23:15.110Z',
          },
          packageDetail: {
            id: '3b336caf-7ca8-4874-99d6-3eee7bc6cf9f',
            packageType: 'DRY',
            weight: 2,
            length: 5,
            width: 6,
            height: 7,
            detailId: '5b97008d-c6fb-4f1c-b4eb-12ccc5c99ae5',
            createdAt: '2024-11-29T04:07:54.201Z',
            updatedAt: '2024-11-29T04:07:54.201Z',
          },
        },
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
      'Only users with the following roles can access this resource: ADMIN, SALES, MANAGER, CLIENT',
    ).getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'Quote request id does not exists in database',
    type: NotFoundException,
    example: new NotFoundException(
      'Quote request id does not exists in database',
    ).getResponse(),
  })
  @ApiBody({
    type: UpdateQuoteReqWithDetailDto,
  })
  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.SALES, RoleEnum.MANAGER, RoleEnum.CLIENT])
  @Patch('with-details/:id')
  async updateQuoteRequestWithDetails(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateQuoteReqWithDetailSchema))
    body: UpdateQuoteReqWithDetailDto,
  ) {
    if (Object.keys(body).length === 0) {
      throw new BadRequestException('Body cannot be empty');
    }
    const result =
      await this.quotationReqsService.updateQuoteRequestWithDetails(id, body);
    return {
      message: 'Quote request successfully updated with its associated details',
      data: result,
    };
  }
}
