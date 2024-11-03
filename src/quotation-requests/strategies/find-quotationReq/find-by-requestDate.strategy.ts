import { Injectable } from '@nestjs/common';
import { IFindQuotationReqStrategy } from './find-quotationReq-strategy.interface';
import { QuotationReq } from '@/quotation-requests/models/quotationReq.model';
import { QuoteReqDetail } from '@/quote-request-details/models/quoteReqDetail.model';

@Injectable()
export class FindQuotationReqByRequestDateStrategy implements IFindQuotationReqStrategy {
    async find(requestDate: string): Promise<QuotationReq[] | null> {
        return QuotationReq.findAll({
            where: { requestDate: requestDate }
        });
    }
}
