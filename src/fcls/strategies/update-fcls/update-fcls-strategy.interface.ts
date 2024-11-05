import { CreateFclDto } from "@/fcls/dtos/create-fcls.dto";
import { FCL } from "@/fcls/models/fcls.model";


export interface IUpdateFclStrategy {
  update(
    fcl_Id: string,
    updateInfo: Partial<CreateFclDto>,
  ): Promise<FCL>;
}