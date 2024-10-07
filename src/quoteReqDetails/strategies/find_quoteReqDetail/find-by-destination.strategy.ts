import { Injectable } from '@nestjs/common';
import { IFindQuoteReqDetailStrategy } from './find-quoteReqDetail-strategy.interface';
import { QuoteReqDetail } from '@/quoteReqDetails/models/quoteReqDetail.model';
import { PackageDetail } from '@/packageDetails/models/packageDetails.model';

@Injectable()
export class FindQuoteReqDetailByDestinationStrategy implements IFindQuoteReqDetailStrategy {
    async find(destination: string): Promise<QuoteReqDetail[] | null> {
        return QuoteReqDetail.findAll({ where: { destination: destination }, include: PackageDetail });
    }
}
