import { CreateLclDto } from "@/lcls/dtos/create-lcls.dto";
import { LCL } from "@/lcls/models/lcls.model";

export interface ICreateLclStrategy {
  create(lclData: CreateLclDto): Promise<LCL>;
}