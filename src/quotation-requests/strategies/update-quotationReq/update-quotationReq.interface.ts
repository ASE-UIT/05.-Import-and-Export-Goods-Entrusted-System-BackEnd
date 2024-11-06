import { UpdateQuotationReqDto } from '@/quotation-requests/dtos/CreateQuotationReqDto';
import { QuotationReq } from '@/quotation-requests/models/quotationReq.model';

export interface IUpdateQuotationReqStrategy {
    update(id: string, quotationReqInfo: UpdateQuotationReqDto): Promise<QuotationReq>;
}
