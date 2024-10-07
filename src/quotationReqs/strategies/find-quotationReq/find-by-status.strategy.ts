import { Injectable } from '@nestjs/common';
import { IFindQuotationReqStrategy } from './find-quotationReq-strategy.interface';
import { QuotationReq, QuotationReqStatus } from '@/quotationReqs/models/quotationReq.model';
import { QuoteReqDetail } from '@/quoteReqDetails/models/quoteReqDetail.model';

@Injectable()
export class FindQuotationReqByStatusStrategy implements IFindQuotationReqStrategy {
    async find(quotationStatus: QuotationReqStatus): Promise<QuotationReq[] | null> {
        return QuotationReq.findAll({
            where: { status: quotationStatus },
            include: QuoteReqDetail
        });
    }
}
