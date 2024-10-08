import { Injectable } from '@nestjs/common';
import { IFindQuotationReqStrategy } from './find-quotationReq-strategy.interface';
import { QuotationReq } from '@/quotationReqs/models/quotationReq.model';
import { QuoteReqDetail } from '@/quoteReqDetails/models/quoteReqDetail.model';

@Injectable()
export class FindQuotationReqByRequestDateStrategy implements IFindQuotationReqStrategy {
    async find(requestDate: string): Promise<QuotationReq[] | null> {
        return QuotationReq.findAll({
            where: { requestDate: requestDate },
            include: QuoteReqDetail
        });
    }
}
