import { UpdateQuotationReqDto } from '@/quotationReqs/dtos/CreateQuotationReqDto';
import { QuotationReq } from '@/quotationReqs/models/quotationReq.model';

export interface IUpdateQuotationReqStrategy {
    update(id: string, quotationReqInfo: UpdateQuotationReqDto): Promise<QuotationReq>;
}
