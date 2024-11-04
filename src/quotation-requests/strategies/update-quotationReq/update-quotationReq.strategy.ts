import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { QuotationReq } from '../../models/quotationReq.model';
import { CreateQuotationReqDto } from '@/quotation-requests/dtos/CreateQuotationReqDto';
import { ForeignKeyConstraintError, UniqueConstraintError } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { ForeignKey } from 'sequelize-typescript';

@Injectable()
export class UpdateQuotationReqStrategy {
    constructor(@InjectModel(QuotationReq) private quotationReqModel: typeof QuotationReq) { }

    async update(id: string, quotationReqInfo: Partial<CreateQuotationReqDto>): Promise<QuotationReq> {
        try {
            const [affectedRows, [updateData]] = await this.quotationReqModel.update(
                { ...quotationReqInfo },
                { where: { id: id }, returning: true },
            )
            return updateData.dataValues as QuotationReq
        } catch (error) {
            if (error instanceof UniqueConstraintError) {
                throw new ConflictException(error.errors[0].message);
            }
            if (error instanceof ForeignKeyConstraintError) {
                throw new ConflictException('Invalid foreign key');
            }
            throw new NotFoundException('Quotation does not exist in database');
        }

    }
}
