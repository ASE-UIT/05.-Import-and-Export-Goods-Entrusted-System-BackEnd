import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { QuoteReqDetail } from "./models/quoteReqDetail.model";
import { QuoteReqDetailsService } from "./quote-request-details.service";
import { QuoteReqDetailsController } from "./quote-request-details.controller";
import { CreateQuoteReqDetailStrategy } from "./strategies/create-quoteReqDetail/create-quoteReqDetail.strategy";
import { UpdateQuoteReqDetailStrategy } from "./strategies/update-quoteReqDetail/update-quoteReqDetail.strategy";
import { FindQuoteReqDetailByOriginStrategy } from "./strategies/find_quoteReqDetail/find-by-origin.strategy";
import { FindQuoteReqDetailByDestinationStrategy } from "./strategies/find_quoteReqDetail/find-by-destination.strategy";
import { FindQuoteReqDetailByShipmentReadyDateStrategy } from "./strategies/find_quoteReqDetail/find-by-shipmentReadyDate.strategy";
import { FindQuoteReqDetailByShipmentDeadlineStrategy } from "./strategies/find_quoteReqDetail/find-by-shipmentDeadline.strategy";
import { FindQuoteReqDetailByCargoInsuranceStrategy } from "./strategies/find_quoteReqDetail/find-by-cargoInsurance.strategy";
import { FindQuoteReqDetailByQuoteReqIdStrategy } from "./strategies/find_quoteReqDetail/find-by-quoteReqId.strategy";
import { FindAllQuoteReqDetailStrategy } from "./strategies/find_quoteReqDetail/find-all.strategy";

@Module({
    imports: [SequelizeModule.forFeature([QuoteReqDetail])],
    providers: [
        QuoteReqDetailsService,
        CreateQuoteReqDetailStrategy,
        UpdateQuoteReqDetailStrategy,
        FindAllQuoteReqDetailStrategy,
        FindQuoteReqDetailByOriginStrategy,
        FindQuoteReqDetailByDestinationStrategy,
        FindQuoteReqDetailByShipmentReadyDateStrategy,
        FindQuoteReqDetailByShipmentDeadlineStrategy,
        FindQuoteReqDetailByCargoInsuranceStrategy,
        FindQuoteReqDetailByQuoteReqIdStrategy
    ],
    controllers: [QuoteReqDetailsController]
})
export class QuoteReqDetailsModule { }