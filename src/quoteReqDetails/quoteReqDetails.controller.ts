import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { QuoteReqDetailsService } from './quoteReqDetails.service';
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
import { CreateQuoteReqDetailDto, CreateQuoteReqDetailSchema } from './dtos/CreateQuoteReqDetailDto';
import { UpdateQuoteReqDetailDto, UpdateQuoteReqDetailSchema } from './dtos/UpdateQuoteReqDetailDto';
import { QueryQuoteReqDetailDto, QueryQuoteReqDetailSchema } from './dtos/QueryQuoteReqDetailDto';
import { FindQuoteReqDetailStrategy } from './strategies/find_quoteReqDetail/find-quoteReqDetail-strategy.enum';

@Controller({
    path: 'quoteReqDetails',
    version: '1',
})
export class QuoteReqDetailsController {
    constructor(private quoteReqDetailsSerivce: QuoteReqDetailsService) { }

    @Get()
    async getQuoteReqDetail(
        @Query(new ZodValidationPipe(QueryQuoteReqDetailSchema)) query: QueryQuoteReqDetailDto
    ) {
        const queryFields: { [key: string]: FindQuoteReqDetailStrategy } = {
            all: FindQuoteReqDetailStrategy.ALL,
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
    }

    @Post()
    async createQuoteReqDetail(
        @Body(new ZodValidationPipe(CreateQuoteReqDetailSchema)) body: CreateQuoteReqDetailDto
    ) {
        await this.quoteReqDetailsSerivce.createQuoteReqDetail(body)
        return { message: "Quote Request Detail Created" }
    }

    @Put(':id')
    async updateQuoteReqDetail(
        @Param('id') id: string, @Body(new ZodValidationPipe(UpdateQuoteReqDetailSchema)) body: UpdateQuoteReqDetailDto) {
        await this.quoteReqDetailsSerivce.updateQuoteReqDetail(id, body)
        return { message: 'Quote Request Detail Updated' }
    }
}
