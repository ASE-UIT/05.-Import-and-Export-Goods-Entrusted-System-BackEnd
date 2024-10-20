import { LandFreight } from '@/landFreight/models/landFreight.model';

export interface IFindLandFreightStrategy {
  find(landFreightInfo: any): Promise<LandFreight[] | null>;
}
