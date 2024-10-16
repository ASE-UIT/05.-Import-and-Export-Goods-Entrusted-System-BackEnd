import { Injectable } from '@nestjs/common';
import { IFindQuotationReqStrategy } from './find-quotationReq-strategy.interface';
import { QuotationReq, QuotationReqStatus } from '@/quotationReqs/models/quotationReq.model';
import { QuoteReqDetail } from '@/quoteReqDetails/models/quoteReqDetail.model';

@Injectable()
export class FindQuotationReqByCustomerIdStrategy implements IFindQuotationReqStrategy {
    async find(customerId: string): Promise<QuotationReq[] | null> {
        return QuotationReq.findAll({
            where: { customerId: customerId },
            include: QuoteReqDetail
        });
    }
}
