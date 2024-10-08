import { Injectable } from '@nestjs/common';
import { QuoteReqDetail } from '@/quoteReqDetails/models/quoteReqDetail.model';
import { PackageDetail } from '@/packageDetails/models/packageDetails.model';

@Injectable()
export class FindAllQuoteReqDetailStrategy {
    async find(quoteReqDetailInfo: string): Promise<QuoteReqDetail[] | null> {
        return quoteReqDetailInfo === 'true' && QuoteReqDetail.findAll({ include: PackageDetail });
    }
}
