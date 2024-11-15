import { UpdateQuotationReqDto } from '@/quotation-requests/dtos/UpdateQuotationReqDto';
import { QuotationReq } from '@/quotation-requests/models/quotationReq.model';

export interface IUpdateQuotationReqStrategy {
    update(id: string, quotationReqInfo: UpdateQuotationReqDto): Promise<QuotationReq>;
}
