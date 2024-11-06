import { CreateFclDto } from "@/fcls/dtos/create-fcls.dto";
import { FCL } from "@/fcls/models/fcls.model";

export interface ICreateFclStrategy {
  create(fclData: CreateFclDto): Promise<FCL>;
}