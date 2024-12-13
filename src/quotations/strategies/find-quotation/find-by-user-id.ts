import { Injectable } from '@nestjs/common';
import { IFindQuotationStrategy } from './find-quotation-strategy.interface';
import { Quotation } from '@/quotations/models/quotations.model';
import { InjectModel } from '@nestjs/sequelize';
import { FindQuotationReqByUserIdStrategy } from '@/quotation-requests/strategies/find-quotationReq/find-by-userId.strategy';

@Injectable()
export class FindQuotationByUserId implements IFindQuotationStrategy {
    constructor(
        @InjectModel(Quotation) private quotationModel: typeof Quotation,
        private findQuotationReqByUserId: FindQuotationReqByUserIdStrategy,
    ) { }

    async find(userId: string): Promise<Quotation[] | null> {
        const quotationReqs = await this.findQuotationReqByUserId.find(userId)
        if (!quotationReqs) return null

        const quotationReqId = quotationReqs.map(req => req.id);
        return this.quotationModel.findAll({
            where: { quoteReqId: quotationReqId },
        });
    }
}
