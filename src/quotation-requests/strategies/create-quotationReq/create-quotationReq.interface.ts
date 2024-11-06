import { QuotationReq } from '@/quotation-requests/models/quotationReq.model';
import { CreateQuotationReqDto } from '../../dtos/CreateQuotationReqDto';

export interface ICreateQuotationReqStrategy {
    create(quotationReqInfo: CreateQuotationReqDto): Promise<QuotationReq>;
}
