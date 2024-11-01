import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { FCL } from "./models/fcl.model";
import { FCLController } from "./fcl.controller";
import { FCLService } from "./fcl.service";
import { CreateFclStrategy } from "./strategies/create-fcl/create-fcl.strategy";
import { FindAllFclStrategy } from "./strategies/find-fcl/find-all.strategy";
import { FindFclByPrice20dcStrategy } from "./strategies/find-fcl/find-by-price-20dc.strategy";
import { FindFclByPrice20rfStrategy } from "./strategies/find-fcl/find-by-price-20rf.strategy";
import { FindFclByPrice40dcStrategy } from "./strategies/find-fcl/find-by-price-40dc.strategy";
import { FindFclByPrice40hcStrategy } from "./strategies/find-fcl/find-by-price-40hc.strategy";
import { FindFclByPrice40rfStrategy } from "./strategies/find-fcl/find-by-price-40rf.strategy";
import { UpdateFclStrategy } from "./strategies/update-fcl/update-fcl.strategy";
import { FindFclByFreightIdStrategy } from "./strategies/find-fcl/find-by-freight-id.strategy";
import { Freight } from "@/freight/models/freight.model";

@Module({
    imports: [SequelizeModule.forFeature([FCL, Freight])],
    controllers: [FCLController],
    providers: [
    FCLService,
    FindFclByPrice20dcStrategy,
    FindFclByPrice40dcStrategy,
    FindFclByPrice40hcStrategy,
    FindFclByPrice20rfStrategy,
    FindFclByPrice40rfStrategy,
    FindFclByFreightIdStrategy,
    FindAllFclStrategy,
    CreateFclStrategy,
    UpdateFclStrategy,
  ],
})

export class FCLModule { }