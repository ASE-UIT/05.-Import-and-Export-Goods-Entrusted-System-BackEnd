import { CreateFclDto } from "@/fcl/dtos/CreateFclDto";
import { FCL } from "@/fcl/models/fcl.model";

export interface ICreateFclStrategy {
  create(fclData: CreateFclDto): Promise<FCL>;
}