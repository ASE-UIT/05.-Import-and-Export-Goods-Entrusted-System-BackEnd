import { Injectable } from '@nestjs/common';
import { IFindQuotationStrategy } from './find-quotation-strategy.interface';
import { Quotation } from '@/quotations/models/quotations.model';
import { FindQuotationReqByCustomerIdStrategy } from '@/quotation-requests/strategies/find-quotationReq/find-by-customerId.strategy';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class FindQuotationByCustomerId implements IFindQuotationStrategy {
    constructor(
        @InjectModel(Quotation) private quotationModel: typeof Quotation,
        private findQuotationReqByCustomerId: FindQuotationReqByCustomerIdStrategy,
    ) { }

    async find(customerId: string): Promise<Quotation[] | null> {
        const quotationReqs = await this.findQuotationReqByCustomerId.find(customerId)
        if (!quotationReqs) return null

        const quotationReqId = quotationReqs.map(req => req.id);
        return this.quotationModel.findAll({
            where: { quoteReqId: quotationReqId },
        });
    }
}
