import { Injectable, NotFoundException } from '@nestjs/common';
import { QuoteReqDetail } from '@/quoteReqDetails/models/quoteReqDetail.model';
import { CreateQuoteReqDetailDto } from '@/quoteReqDetails/dtos/CreateQuoteReqDetailDto';

@Injectable()
export class UpdateQuoteReqDetailStrategy {
    constructor() { }

    async update(id: string, quoteReqDetailInfo: Partial<CreateQuoteReqDetailDto>): Promise<QuoteReqDetail> {
        const [affectedRows, [updateData]] = await QuoteReqDetail.update(
            { ...quoteReqDetailInfo },
            { where: { id: id }, returning: true },
        )
        if (affectedRows == 0) {
            throw new NotFoundException('Quote request detail id does not exists in database')
        }
        return updateData.dataValues as QuoteReqDetail
    }
}
