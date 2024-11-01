import { CreateFclDto } from "@/fcl/dtos/CreateFclDto";
import { FCL } from "@/fcl/models/fcl.model";


export interface IUpdateFclStrategy {
  update(
    fcl_Id: string,
    updateInfo: Partial<CreateFclDto>,
  ): Promise<FCL>;
}