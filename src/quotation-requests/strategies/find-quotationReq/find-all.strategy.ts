import { Injectable } from '@nestjs/common';
import { QuotationReq } from '@/quotation-requests/models/quotationReq.model';
import { QuoteReqDetail } from '@/quote-request-details/models/quoteReqDetail.model';
import { IFindQuotationReqStrategy } from './find-quotationReq-strategy.interface';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class FindAllQuotationReqStrategy implements IFindQuotationReqStrategy {
    constructor(@InjectModel(QuotationReq) private quotationReqModel: typeof QuotationReq) { }

    async find(): Promise<QuotationReq[] | null> {
        return await this.quotationReqModel.findAll();
    }
}
