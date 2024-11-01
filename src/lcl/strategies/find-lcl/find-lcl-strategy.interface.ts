import { LCL } from '@/lcl/models/lcl.model';

export interface IFindLclStrategy {
  find(lclInfo: any): Promise<LCL[] | null>;
}
