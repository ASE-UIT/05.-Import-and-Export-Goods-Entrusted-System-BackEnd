import { QuotationReq } from '@/quotation-requests/models/quotationReq.model';

export interface IFindQuotationReqStrategy {
    find(quotationReqInfo: string): Promise<QuotationReq[] | null>;
}
