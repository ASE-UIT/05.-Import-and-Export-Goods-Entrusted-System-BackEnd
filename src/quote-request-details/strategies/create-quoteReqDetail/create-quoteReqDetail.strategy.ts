import { Injectable } from '@nestjs/common';
import { ICreateQuoteReqDetailStrategy } from './create-quoteReqDetail.interface';
import { CreateQuoteReqDetailDto } from '@/quote-request-details/dtos/CreateQuoteReqDetailDto';
import { QuoteReqDetail } from '@/quote-request-details/models/quoteReqDetail.model';

@Injectable()
export class CreateQuoteReqDetailStrategy implements ICreateQuoteReqDetailStrategy {
    async create(quoteReqDetailInfo: CreateQuoteReqDetailDto): Promise<QuoteReqDetail> {

        const quoteReqDetail = new QuoteReqDetail()
        quoteReqDetail.origin = quoteReqDetailInfo.origin
        quoteReqDetail.destination = quoteReqDetailInfo.destination
        quoteReqDetail.shipmentReadyDate = quoteReqDetailInfo.shipmentReadyDate
        quoteReqDetail.shipmentDeadline = quoteReqDetailInfo.shipmentDeadline
        quoteReqDetail.cargoInsurance = quoteReqDetailInfo.cargoInsurance
        quoteReqDetail.quoteReqId = quoteReqDetailInfo.quoteReqId
        await quoteReqDetail.save()
        return quoteReqDetail
    }
}
