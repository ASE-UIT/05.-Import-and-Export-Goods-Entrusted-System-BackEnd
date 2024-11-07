import { LandFreight } from '@/land-freights/models/land-freights.model';

export interface IFindLandFreightStrategy {
  find(landFreightInfo: any): Promise<LandFreight[] | null>;
}
