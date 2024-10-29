import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { LCL } from "./models/lcl.model";

@Module({
    imports: [SequelizeModule.forFeature([LCL])]
})

export class LCLModule { }