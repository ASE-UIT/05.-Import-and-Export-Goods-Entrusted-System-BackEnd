import { Injectable } from '@nestjs/common';
import { ICreateQuotationReqStrategy } from './create-quotationReq.interface';
import { CreateQuotationReqDto } from '../../dtos/CreateQuotationReqDto';
import { QuotationReq, QuotationReqStatus } from '../../models/quotationReq.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class CreateQuotationReqStrategy implements ICreateQuotationReqStrategy {
    constructor(@InjectModel(QuotationReq) private quotationReqModel: typeof QuotationReq) { }

    async create(quotationReqInfo: CreateQuotationReqDto): Promise<QuotationReq> {
        // const quotationReq = new QuotationReq()
        // quotationReq.requestDate = quotationReqInfo.requestDate
        // quotationReq.status = quotationReqInfo.status || QuotationReqStatus.PENDING
        // quotationReq.customerId = quotationReqInfo.customerId
        // await quotationReq.save()

        const newQuotationReq = await this.quotationReqModel.create({
            requestDate: quotationReqInfo.requestDate,
            status: QuotationReqStatus.PENDING,
            userId: quotationReqInfo.userId
        })
        return newQuotationReq
    }
}
