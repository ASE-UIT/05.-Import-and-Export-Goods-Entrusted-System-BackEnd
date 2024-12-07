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
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { QuoteReqDetailsService } from './quote-request-details.service';
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
import {
  CreateQuoteReqDetailDto,
  CreateQuoteReqDetailSchema,
} from './dtos/CreateQuoteReqDetailDto';
import {
  QueryQuoteReqDetailDto,
  QueryQuoteReqDetailSchema,
} from './dtos/QueryQuoteReqDetailDto';
import { FindQuoteReqDetailStrategy } from './strategies/find_quoteReqDetail/find-quoteReqDetail-strategy.enum';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '@/shared/decorators/role.decorator';
import { RoleEnum } from '@/shared/enums/roles.enum';
import { RoleGuard } from '@/shared/guards/role.guard';
import { QuoteReqDetail } from './models/quoteReqDetail.model';
import { createResponseType } from '@/shared/helpers/create-response.mixin';
import { UpdateQuotationReqSchema } from '@/quotation-requests/dtos/UpdateQuotationReqDto';
import {
  UpdateQuoteReqDetailDto,
  UpdateQuoteReqDetailSchema,
} from './dtos/UpdateQuoteReqDetailDto';

@ApiTags('quote request details')
@Controller({
  path: 'quote-request-details',
  version: '1',
})
export class QuoteReqDetailsController {
  constructor(private quoteReqDetailsSerivce: QuoteReqDetailsService) {}

  @ApiOperation({
    summary: 'Retrieve quote request details based on query parameters',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved quote requests',
    type: QuoteReqDetail,
    example: [
      {
        id: 'b8992c5b-4030-4d89-8cd3-515d71949f9f',
        origin: 'Long An',
        destination: 'Tien Giang',
        shipmentReadyDate: '2023-10-10T00:00:00.000Z',
        shipmentDeadline: '2023-10-14T00:00:00.000Z',
        cargoInsurance: true,
        quoteReqId: 'b940be0c-2193-4b9c-a825-e5b2ab605b11',
        createdAt: '2024-10-31T07:13:01.039Z',
        updatedAt: '2024-10-31T07:13:01.039Z',
      },
    ],
  })
  @ApiResponse({
    status: 401,
    description: 'Not logged in or account has unappropriate role',
    type: UnauthorizedException,
    example: new UnauthorizedException(
      'Only authenticated users can access this resource',
    ).getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'No quote request detail found',
    type: NotFoundException,
    example: new NotFoundException(
      'No quote request detail found',
    ).getResponse(),
  })
  @ApiQuery({ name: 'origin', required: false, type: String })
  @ApiQuery({ name: 'destination', required: false, type: String })
  @ApiQuery({ name: 'quoteReqId', required: false, type: String })
  @ApiQuery({ name: 'shipmentReadyDate', required: false, type: String })
  @ApiQuery({ name: 'shipmentDeadline', required: false, type: String })
  @UseGuards(RoleGuard)
  @Get()
  async getQuoteReqDetail(
    @Query(new ZodValidationPipe(QueryQuoteReqDetailSchema))
    query: QueryQuoteReqDetailDto,
  ) {
    const result = await this.quoteReqDetailsSerivce.findQuoteReqDetail(query);
    return result;
  }

  @ApiOperation({
    summary: 'Retrieve quote request details by id',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved quote request details',
    type: QuoteReqDetail,
    example: {
      id: 'b8992c5b-4030-4d89-8cd3-515d71949f9f',
      origin: 'Long An',
      destination: 'Tien Giang',
      shipmentReadyDate: '2023-10-10T00:00:00.000Z',
      shipmentDeadline: '2023-10-14T00:00:00.000Z',
      cargoInsurance: true,
      quoteReqId: 'b940be0c-2193-4b9c-a825-e5b2ab605b11',
      createdAt: '2024-10-31T07:13:01.039Z',
      updatedAt: '2024-10-31T07:13:01.039Z',
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Not logged in or account has unappropriate role',
    type: UnauthorizedException,
    example: new UnauthorizedException(
      'Only authenticated users can access this resource',
    ).getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'No quote request detail found',
    type: NotFoundException,
    example: new NotFoundException(
      'No quote request detail found',
    ).getResponse(),
  })
  @UseGuards(RoleGuard)
  @Get(':id')
  async getQuoteReqDetailById(@Param('id') id: string) {
    const quoteReqDetail =
      await this.quoteReqDetailsSerivce.findQuoteReqDetailById(id);
    return quoteReqDetail;
  }

  //create new quote request detail

  @ApiOperation({ summary: 'Create a new quote request detail' })
  @ApiResponse({
    status: 201,
    description: 'Quote request detail successfully created',
    type: createResponseType(
      'Quote request detail successfully created',
      QuoteReqDetail,
    ),
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid foreign key',
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
    type: CreateQuoteReqDetailDto,
    schema: {
      example: {
        origin: 'Tay Ninh',
        destination: 'Sai Gon',
        shipmentReadyDate: '2024-10-23',
        shipmentDeadline: '2024-11-23',
        cargoInsurance: false,
        quoteReqId: '1c26b2ca-a13c-40a7-9903-fa092e2ecb5c',
      },
    },
  })
  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.SALES, RoleEnum.MANAGER])
  @Post()
  async createQuoteReqDetail(
    @Body(new ZodValidationPipe(CreateQuoteReqDetailSchema))
    body: CreateQuoteReqDetailDto,
  ) {
    const quoteReqDetail =
      await this.quoteReqDetailsSerivce.createQuoteReqDetail(body);
    return { message: 'Quote Request Detail Created', data: quoteReqDetail };
  }

  //update quote request detail

  @ApiOperation({ summary: 'Update quote request detail' })
  @ApiResponse({
    status: 200,
    description: 'Quote request detail successfully updated',
    type: createResponseType(
      'Quote request detail successfully updated',
      QuoteReqDetail,
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
    description: 'Quote request detail id does not exists in database',
    type: NotFoundException,
    example: new NotFoundException(
      'Quote request detail id does not exists in database',
    ).getResponse(),
  })
  @ApiBody({
    type: UpdateQuoteReqDetailDto,
    schema: {
      example: {
        origin: 'Tay Ninh',
        destination: 'Sai Gon',
        shipmentReadyDate: '2024-10-23',
        shipmentDeadline: '2024-11-23',
        cargoInsurance: false,
        quoteReqId: '1c26b2ca-a13c-40a7-9903-fa092e2ecb5c',
      },
    },
  })
  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.SALES, RoleEnum.MANAGER])
  @Patch(':id')
  async updateQuoteReqDetail(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateQuoteReqDetailSchema))
    body: Partial<UpdateQuoteReqDetailDto>,
  ) {
    //check if body is empty
    if (Object.keys(body).length === 0) {
      throw new BadRequestException('Body cannot be empty');
    }
    const quoteReqDetail =
      await this.quoteReqDetailsSerivce.updateQuoteReqDetail(id, body);
    return {
      message: 'Quote Request Detail updated successfully',
      data: quoteReqDetail,
    };
  }
}
