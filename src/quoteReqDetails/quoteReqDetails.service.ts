import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuoteReqDetailDto } from './dtos/CreateQuoteReqDetailDto';
import { CreateQuoteReqDetailStrategy } from './strategies/create-quoteReqDetail/create-quoteReqDetail.strategy';
import { UpdateQuoteReqDetailDto } from './dtos/UpdateQuoteReqDetailDto';
import { UpdateQuoteReqDetailStrategy } from './strategies/update-quoteReqDetail/update-quoteReqDetail.strategy';
import { FindQuoteReqDetailStrategy } from './strategies/find_quoteReqDetail/find-quoteReqDetail-strategy.enum';
import { QuoteReqDetail } from './models/quoteReqDetail.model';
import { IFindQuoteReqDetailStrategy } from './strategies/find_quoteReqDetail/find-quoteReqDetail-strategy.interface';
import { FindAllQuotationReqStrategy } from '@/quotationReqs/strategies/find-quotationReq/find-all.strategy';
import { FindQuoteReqDetailByOriginStrategy } from './strategies/find_quoteReqDetail/find-by-origin.strategy';
import { FindQuoteReqDetailByDestinationStrategy } from './strategies/find_quoteReqDetail/find-by-destination.strategy';
import { FindQuoteReqDetailByShipmentReadyDateStrategy } from './strategies/find_quoteReqDetail/find-by-shipmentReadyDate.strategy';
import { FindQuoteReqDetailByShipmentDeadlineStrategy } from './strategies/find_quoteReqDetail/find-by-shipmentDeadline.strategy';
import { FindQuoteReqDetailByCargoInsuranceStrategy } from './strategies/find_quoteReqDetail/find-by-cargoInsurance.strategy';
import { FindQuoteReqDetailByQuoteReqIdStrategy } from './strategies/find_quoteReqDetail/find-by-quoteReqId.strategy';
import { FindAllQuoteReqDetailStrategy } from './strategies/find_quoteReqDetail/find-all.strategy';
import { BaseError, HostNotFoundError } from 'sequelize';

@Injectable()
export class QuoteReqDetailsService {
    constructor(
        private createQuoteReqDetailStrategy: CreateQuoteReqDetailStrategy,
        private updateQuoteReqDetailStrategy: UpdateQuoteReqDetailStrategy,
        private findAllQuoteReqDetailStrategy: FindAllQuoteReqDetailStrategy,
        private findQuoteReqDetailByOrigin: FindQuoteReqDetailByOriginStrategy,
        private findQuoteReqDetailByDestination: FindQuoteReqDetailByDestinationStrategy,
        private findQuoteReqDetailByShipmentReadyDate: FindQuoteReqDetailByShipmentReadyDateStrategy,
        private findQuoteReqDetailByShipmentDeadline: FindQuoteReqDetailByShipmentDeadlineStrategy,
        private findQuoteReqDetailByCargoInsurance: FindQuoteReqDetailByCargoInsuranceStrategy,
        private findQuoteReqDetailByQuoteReqId: FindQuoteReqDetailByQuoteReqIdStrategy
    ) { }

    async findQuoteReqDetail(
        strategy: FindQuoteReqDetailStrategy,
        quoteReqDetailInfo: string
    ): Promise<QuoteReqDetail[] | null> {
        const findStrategy = this.getFindStrategy(strategy)
        const quoteReqDetail: QuoteReqDetail[] | null = await findStrategy.find(quoteReqDetailInfo)
        return quoteReqDetail
    }

    getFindStrategy(strategy: FindQuoteReqDetailStrategy): IFindQuoteReqDetailStrategy {
        switch (strategy) {
            case FindQuoteReqDetailStrategy.ALL:
                return this.findAllQuoteReqDetailStrategy
            case FindQuoteReqDetailStrategy.ORIGIN:
                return this.findQuoteReqDetailByOrigin
            case FindQuoteReqDetailStrategy.DESTINATION:
                return this.findQuoteReqDetailByDestination
            case FindQuoteReqDetailStrategy.SHIPMENTREADYDATE:
                return this.findQuoteReqDetailByShipmentReadyDate
            case FindQuoteReqDetailStrategy.SHIPMENTDEADLINE:
                return this.findQuoteReqDetailByShipmentDeadline
            case FindQuoteReqDetailStrategy.CARGOINSURANCE:
                return this.findQuoteReqDetailByCargoInsurance
            case FindQuoteReqDetailStrategy.QUOTEREQID:
                return this.findQuoteReqDetailByQuoteReqId
        }
    }

    async createQuoteReqDetail(quoteReqDetailInfo: CreateQuoteReqDetailDto): Promise<QuoteReqDetail> {
        try {
            return await this.createQuoteReqDetailStrategy.create(quoteReqDetailInfo)
        } catch (error) {
            throw new Error('Error when create quote request detail')
        }
    }

    async updateQuoteReqDetail(id: string, quoteReqDetailInfo: Partial<CreateQuoteReqDetailDto>): Promise<{
        message: string,
        data: QuoteReqDetail
    }> {
        const updatedResponse = await this.updateQuoteReqDetailStrategy.update(id, quoteReqDetailInfo)
        return { message: 'Quote Request Detail updated successfully', data: updatedResponse }
    }
}
