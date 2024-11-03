import { Injectable } from '@nestjs/common';
import { QuotationReq } from '@/quotation-requests/models/quotationReq.model';
import { QuoteReqDetail } from '@/quote-request-details/models/quoteReqDetail.model';

@Injectable()
export class FindAllQuotationReqStrategy {
    async find(): Promise<QuotationReq[] | null> {
        return QuotationReq.findAll();
    }
}
