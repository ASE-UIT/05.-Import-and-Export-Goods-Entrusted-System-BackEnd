import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { QuoteReqDetailsService } from './quote-request-details.service';
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
import { CreateQuoteReqDetailDto, CreateQuoteReqDetailSchema, UpdateQuoteReqDetailDto } from './dtos/CreateQuoteReqDetailDto';
import { QueryQuoteReqDetailDto, QueryQuoteReqDetailSchema } from './dtos/QueryQuoteReqDetailDto';
import { FindQuoteReqDetailStrategy } from './strategies/find_quoteReqDetail/find-quoteReqDetail-strategy.enum';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '@/shared/decorators/role.decorator';
import { RoleEnum } from '@/shared/enums/roles.enum';
import { RoleGuard } from '@/shared/guards/role.guard';

@ApiTags('quote request details')
@Controller({
    path: 'quote-request-details',
    version: '1',
})
export class QuoteReqDetailsController {
    constructor(private quoteReqDetailsSerivce: QuoteReqDetailsService) { }

    @UseGuards(RoleGuard)
    @Roles([
        RoleEnum.ADMIN,
        RoleEnum.SALES,
        RoleEnum.MANAGER,
    ])
    @Get()
    @ApiOperation({ summary: 'Retrieve quote request details based on query parameters' })
    @ApiResponse({ status: 401, description: 'Not logged in or account has unappropriate role' })
    @ApiResponse({ status: 404, description: 'No quote request detail found' })
    @ApiResponse({ status: 200, description: 'Successfully retrieved quote requests' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    @ApiQuery({ name: 'origin', required: false, type: String })
    @ApiQuery({ name: 'destination', required: false, type: String })
    @ApiQuery({ name: 'quoteReqId', required: false, type: String })
    @ApiQuery({ name: 'shipmentReadyDate', required: false, type: String })
    @ApiQuery({ name: 'shipmentDeadline', required: false, type: String })
    async getQuoteReqDetail(
        @Query(new ZodValidationPipe(QueryQuoteReqDetailSchema)) query: QueryQuoteReqDetailDto
    ) {
        if (Object.keys(query).length === 0)
            return await this.quoteReqDetailsSerivce.findQuoteReqDetail(
                FindQuoteReqDetailStrategy.ALL,
                '',
            )

        const queryFields: { [key: string]: FindQuoteReqDetailStrategy } = {
            origin: FindQuoteReqDetailStrategy.ORIGIN,
            destination: FindQuoteReqDetailStrategy.DESTINATION,
            shipmentReadyDate: FindQuoteReqDetailStrategy.SHIPMENTREADYDATE,
            shipmentDeadline: FindQuoteReqDetailStrategy.SHIPMENTDEADLINE,
            cargoInsurance: FindQuoteReqDetailStrategy.CARGOINSURANCE,
            quoteReqId: FindQuoteReqDetailStrategy.QUOTEREQID
        }

        // Assign corrisponding strategy to query fields
        for (const [key, strategy] of Object.entries(queryFields)) {
            const value = query[key as keyof QueryQuoteReqDetailDto];
            if (value) {
                const quoteReqDetail = await this.quoteReqDetailsSerivce.findQuoteReqDetail(
                    strategy,
                    value,
                );
                if (quoteReqDetail.length > 0) {
                    if (strategy === FindQuoteReqDetailStrategy.ALL || quoteReqDetail.length > 1)
                        return quoteReqDetail;
                    else return quoteReqDetail[0];
                }
            }
        }

        throw new NotFoundException('Quote request detail not found')
    }

    //create new quote request detail
    @UseGuards(RoleGuard)
    @Roles([
        RoleEnum.ADMIN,
        RoleEnum.SALES,
        RoleEnum.MANAGER,
    ])
    @ApiOperation({ summary: 'Create a new quote request detail' })
    @ApiResponse({ status: 201, description: 'Quote request detail successfully created' })
    @ApiResponse({ status: 400, description: 'Invalid foreign key.' })
    @ApiResponse({ status: 401, description: 'Not logged in or account has unappropriate role' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    @ApiBody({
        type: CreateQuoteReqDetailDto,
        schema: {
            example: {
                origin: "Tay Ninh",
                destination: "Sai Gon",
                shipmentReadyDate: "2024-10-23",
                shipmentDeadline: "2024-11-23",
                cargoInsurance: false,
                quoteReqId: "1c26b2ca-a13c-40a7-9903-fa092e2ecb5c"
            },
        },
    })
    @Post()
    async createQuoteReqDetail(
        @Body(new ZodValidationPipe(CreateQuoteReqDetailSchema)) body: CreateQuoteReqDetailDto
    ) {
        const quoteReqDetail = await this.quoteReqDetailsSerivce.createQuoteReqDetail(body)
        return { message: "Quote Request Detail Created", data: quoteReqDetail }
    }

    //update quote request detail
    @UseGuards(RoleGuard)
    @Roles([
        RoleEnum.ADMIN,
        RoleEnum.SALES,
        RoleEnum.MANAGER,
    ])
    @Patch(':id')
    @ApiOperation({ summary: 'Update quote request detail' })
    @ApiResponse({ status: 200, description: 'Quote request detail successfully updated' })
    @ApiResponse({ status: 400, description: 'Invalid foreign key' })
    @ApiResponse({ status: 401, description: 'Not logged in or account has unappropriate role' })
    @ApiResponse({ status: 404, description: "Quote request detail id does not exists in database" })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    @ApiBody({
        type: UpdateQuoteReqDetailDto,
        schema: {
            example: {
                origin: "Tay Ninh",
                destination: "Sai Gon",
                shipmentReadyDate: "2024-10-23",
                shipmentDeadline: "2024-11-23",
                cargoInsurance: false,
                quoteReqId: "1c26b2ca-a13c-40a7-9903-fa092e2ecb5c"
            },
        },
    })
    async updateQuoteReqDetail(
        @Param('id') id: string,
        @Body(new ZodValidationPipe(CreateQuoteReqDetailSchema.partial())) body: Partial<CreateQuoteReqDetailDto>) {
        //check if body is empty 
        if (Object.keys(body).length === 0) {
            throw new BadRequestException('Body cannot be empty')
        }
        const quoteReqDetail = await this.quoteReqDetailsSerivce.updateQuoteReqDetail(id, body)
        return { message: 'Quote Request Detail updated successfully', data: quoteReqDetail }
    }
}
