import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { QuotationReq } from '../../models/quotationReq.model';
import { CreateQuotationReqDto } from '@/quotation-requests/dtos/CreateQuotationReqDto';
import { UniqueConstraintError } from 'sequelize';

@Injectable()
export class UpdateQuotationReqStrategy {
    constructor() { }

    async update(id: string, quotationReqInfo: Partial<CreateQuotationReqDto>): Promise<QuotationReq> {
        try {
            const [affectedRows, [updateData]] = await QuotationReq.update(
                { ...quotationReqInfo },
                { where: { id: id }, returning: true },
            )
            return updateData.dataValues as QuotationReq
        } catch (error) {
            if (error instanceof TypeError) {
                throw new NotFoundException('Customer not found');
            }
            if (error instanceof UniqueConstraintError) {
                throw new ConflictException(error.errors[0].message);
            }
        }

    }
}
