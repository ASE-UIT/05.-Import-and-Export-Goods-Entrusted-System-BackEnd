import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { FCL } from "./models/fcls.model";
import { FCLController } from "./fcls.controller";
import { FCLService } from "./fcls.service";
import { CreateFclStrategy } from "./strategies/create-fcls/create-fcls.strategy";
import { UpdateFclStrategy } from "./strategies/update-fcls/update-fcls.strategy";
import { Freight } from "@/freights/models/freights.model";

@Module({
    imports: [SequelizeModule.forFeature([FCL, Freight])],
    controllers: [FCLController],
    providers: [
    FCLService,
    CreateFclStrategy,
    UpdateFclStrategy,
  ],
})

export class FCLModule { }