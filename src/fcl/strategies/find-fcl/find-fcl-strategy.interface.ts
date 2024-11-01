import { FCL } from "@/fcl/models/fcl.model";

export interface IFindFclStrategy {
  find(fclInfo: any): Promise<FCL[] | null>;
}
