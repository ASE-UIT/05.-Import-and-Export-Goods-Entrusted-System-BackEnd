import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { LCL } from "./models/lcls.model";
import { CreateLclStrategy } from "./strategies/create-lcls/create-lcls.strategy";
import { UpdateLclStrategy } from "./strategies/update-lcls/update-lcls.strategy";
import { LCLController } from "./lcls.controller";
import { LCLService } from "./lcls.service";
import { Freight } from "@/freights/models/freights.model";

@Module({
    imports: [SequelizeModule.forFeature([LCL, Freight])],
    controllers: [LCLController],
    providers: [
    LCLService,
    CreateLclStrategy,
    UpdateLclStrategy,
  ],
})

export class LCLModule { }