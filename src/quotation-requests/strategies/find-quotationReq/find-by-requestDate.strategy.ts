import { Injectable } from '@nestjs/common';
import { IFindQuotationReqStrategy } from './find-quotationReq-strategy.interface';
import { QuotationReq } from '@/quotation-requests/models/quotationReq.model';
import { QuoteReqDetail } from '@/quote-request-details/models/quoteReqDetail.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class FindQuotationReqByRequestDateStrategy implements IFindQuotationReqStrategy {
    constructor(@InjectModel(QuotationReq) private quotationReqModel: typeof QuotationReq) { }

    async find(requestDate: string): Promise<QuotationReq[] | null> {
        return await this.quotationReqModel.findAll({
            where: { requestDate: requestDate }
        });
    }
}
