import { FCL } from "@/fcls/models/fcls.model";

export interface IFindFclStrategy {
  find(fclInfo: any): Promise<FCL[] | null>;
}
