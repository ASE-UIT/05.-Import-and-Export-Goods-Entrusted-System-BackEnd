import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QuoteReqDetail } from '@/quoteReqDetails/models/quoteReqDetail.model';
import { UpdateQuoteReqDetailDto } from '@/quoteReqDetails/dtos/UpdateQuoteReqDetailDto';

@Injectable()
export class UpdateQuoteReqDetailStrategy {
    constructor(
        @InjectModel(QuoteReqDetail)
        private quoteReqDetailModel: typeof QuoteReqDetail,
    ) { }

    async update(id: string, quoteReqDetailInfo: UpdateQuoteReqDetailDto): Promise<void> {
        const quoteReqDetail = await this.quoteReqDetailModel.findByPk(id)

        if (!quoteReqDetail) {
            throw new NotFoundException(`QuotationReq with id ${id} not found`)
        }

        await quoteReqDetail.update(quoteReqDetailInfo)
    }
}
