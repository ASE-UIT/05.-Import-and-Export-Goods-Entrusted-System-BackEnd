import { LCL } from '@/lcls/models/lcls.model';

export interface IFindLclStrategy {
  find(lclInfo: any): Promise<LCL[] | null>;
}
