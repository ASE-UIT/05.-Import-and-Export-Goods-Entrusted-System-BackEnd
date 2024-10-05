import { Injectable, NotFoundException } from '@nestjs/common';
import { QuotationReq } from '../../models/quotationReq.model';
import { InjectModel } from '@nestjs/sequelize';
import { UpdateQuotationReqDto } from '@/quotationReqs/dtos/UpdateQuotationReqDto';

@Injectable()
export class UpdateQuotationReqStrategy {
    constructor(
        @InjectModel(QuotationReq)
        private quotationReqModel: typeof QuotationReq,
    ) { }

    async update(id: string, quotationReqInfo: UpdateQuotationReqDto): Promise<void> {
        const quotationReq = await this.quotationReqModel.findByPk(id)

        if (!quotationReq) {
            throw new NotFoundException(`QuotationReq with id ${id} not found`)
        }

        await quotationReq.update(quotationReqInfo)
    }
}
