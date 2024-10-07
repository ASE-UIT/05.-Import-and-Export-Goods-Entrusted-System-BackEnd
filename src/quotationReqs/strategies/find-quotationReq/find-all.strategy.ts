import { Injectable } from '@nestjs/common';
import { QuotationReq } from '@/quotationReqs/models/quotationReq.model';
import { QuoteReqDetail } from '@/quoteReqDetails/models/quoteReqDetail.model';

@Injectable()
export class FindAllQuotationReqStrategy {
    async find(quotationReqInfo: string): Promise<QuotationReq[] | null> {
        return quotationReqInfo === 'true' && QuotationReq.findAll({ include: QuoteReqDetail });
    }
}
