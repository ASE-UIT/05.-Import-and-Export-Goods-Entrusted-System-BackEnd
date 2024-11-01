import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { LCL } from "./models/lcl.model";
import { CreateLclStrategy } from "./strategies/create-lcl/create-lcl.strategy";
import { FindAllLclStrategy } from "./strategies/find-lcl/find-all.strategy";
import { FindLclByCostStrategy } from "./strategies/find-lcl/find-by-cost.strategy";
import { UpdateLclStrategy } from "./strategies/update-lcl/update-lcl.strategy";
import { LCLController } from "./lcl.controller";
import { LCLService } from "./lcl.service";
import { FindLclByFreightIdStrategy } from "./strategies/find-lcl/find-by-freight-id.strategy";
import { Freight } from "@/freight/models/freight.model";

@Module({
    imports: [SequelizeModule.forFeature([LCL, Freight])],
    controllers: [LCLController],
    providers: [
    LCLService,
    FindLclByCostStrategy,
    FindLclByFreightIdStrategy,
    FindAllLclStrategy,
    CreateLclStrategy,
    UpdateLclStrategy,
  ],
})

export class LCLModule { }