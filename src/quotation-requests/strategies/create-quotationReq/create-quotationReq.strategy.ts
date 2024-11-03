import { Injectable } from '@nestjs/common';
import { ICreateQuotationReqStrategy } from './create-quotationReq.interface';
import { CreateQuotationReqDto } from '../../dtos/CreateQuotationReqDto';
import { QuotationReq, QuotationReqStatus } from '../../models/quotationReq.model';

@Injectable()
export class CreateQuotationReqStrategy implements ICreateQuotationReqStrategy {
    async create(quotationReqInfo: CreateQuotationReqDto): Promise<QuotationReq> {
        const quotationReq = new QuotationReq()
        quotationReq.requestDate = quotationReqInfo.requestDate
        quotationReq.status = quotationReqInfo.status || QuotationReqStatus.PENDING
        quotationReq.customerId = quotationReqInfo.customerId
        await quotationReq.save()
        return quotationReq
    }
}
