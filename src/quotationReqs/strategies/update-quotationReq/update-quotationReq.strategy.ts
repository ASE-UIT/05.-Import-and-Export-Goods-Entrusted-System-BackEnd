import { Injectable, NotFoundException } from '@nestjs/common';
import { QuotationReq } from '../../models/quotationReq.model';
import { UpdateQuotationReqDto } from '@/quotationReqs/dtos/UpdateQuotationReqDto';
import { CreateQuotationReqDto } from '@/quotationReqs/dtos/CreateQuotationReqDto';

@Injectable()
export class UpdateQuotationReqStrategy {
    constructor() { }

    async update(id: string, quotationReqInfo: Partial<CreateQuotationReqDto>): Promise<QuotationReq> {
        const [affectedRows, [updateData]] = await QuotationReq.update(
            { ...quotationReqInfo },
            { where: { id: id }, returning: true },
        )
        if (affectedRows == 0) {
            throw new NotFoundException('Quote request id does not exists in database')
        }
        return updateData.dataValues as QuotationReq
    }
}
