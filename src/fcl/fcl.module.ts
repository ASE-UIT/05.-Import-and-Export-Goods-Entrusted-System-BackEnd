import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { FCL } from "./models/fcl.model";

@Module({
    imports: [SequelizeModule.forFeature([FCL])]
})

export class FCLModule { }