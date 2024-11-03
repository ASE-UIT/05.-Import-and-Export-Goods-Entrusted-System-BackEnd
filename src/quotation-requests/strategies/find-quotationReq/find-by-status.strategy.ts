import { Injectable } from '@nestjs/common';
import { IFindQuotationReqStrategy } from './find-quotationReq-strategy.interface';
import { QuotationReq, QuotationReqStatus } from '@/quotation-requests/models/quotationReq.model';
import { QuoteReqDetail } from '@/quote-request-details/models/quoteReqDetail.model';

@Injectable()
export class FindQuotationReqByStatusStrategy implements IFindQuotationReqStrategy {
    async find(quotationStatus: QuotationReqStatus): Promise<QuotationReq[] | null> {
        return QuotationReq.findAll({
            where: { status: quotationStatus }
        });
    }
}
