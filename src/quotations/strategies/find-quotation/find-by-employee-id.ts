import { Injectable } from '@nestjs/common';
import { IFindQuotationStrategy } from './find-quotation-strategy.interface';
import { Quotation } from '@/quotations/models/quotations.model';

@Injectable()
export class FindQuotationByEmployeeId implements IFindQuotationStrategy {
    find(employeeId: string): Promise<Quotation[] | null> {
        return Quotation.findAll({
            where: { employeeId: employeeId },
        });
    }
}
