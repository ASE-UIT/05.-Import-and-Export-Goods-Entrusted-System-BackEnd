import { CreateQuotationReqDto } from '../../dtos/CreateQuotationReqDto';

export interface ICreateQuotationReqStrategy {
    create(quotationReqInfo: CreateQuotationReqDto): Promise<void>;
}
