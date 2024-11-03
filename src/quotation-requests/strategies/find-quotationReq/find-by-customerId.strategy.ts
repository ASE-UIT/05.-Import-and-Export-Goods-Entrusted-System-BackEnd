import { Injectable } from '@nestjs/common';
import { IFindQuotationReqStrategy } from './find-quotationReq-strategy.interface';
import { QuotationReq, QuotationReqStatus } from '@/quotation-requests/models/quotationReq.model';
import { QuoteReqDetail } from '@/quote-request-details/models/quoteReqDetail.model';

@Injectable()
export class FindQuotationReqByCustomerIdStrategy implements IFindQuotationReqStrategy {
    async find(customerId: string): Promise<QuotationReq[] | null> {
        return QuotationReq.findAll({
            where: { customerId: customerId }
        });
    }
}
