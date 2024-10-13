import { LandFreight } from '@/landFreight/models/landFreight.model';

export interface IFindLandFreightStrategy {
  find(landFreightInfo: string | number): Promise<LandFreight[] | null>;
}
