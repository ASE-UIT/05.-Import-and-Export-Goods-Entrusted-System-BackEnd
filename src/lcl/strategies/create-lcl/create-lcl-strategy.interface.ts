import { CreateLclDto } from "@/lcl/dtos/CreateLclDto";
import { LCL } from "@/lcl/models/lcl.model";

export interface ICreateLclStrategy {
  create(lclData: CreateLclDto): Promise<LCL>;
}