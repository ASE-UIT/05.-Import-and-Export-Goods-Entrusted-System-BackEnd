import { QuotationReq } from '@/quotationReqs/models/quotationReq.model';

export interface IFindQuotationReqStrategy {
    find(quotationReqInfo: string): Promise<QuotationReq[] | null>;
}
