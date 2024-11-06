import { SeaFreight } from '@/seaFreight/models/seaFreight.model';

export interface IFindSeaFreightStrategy {
  find(seaFreightInfo: any): Promise<SeaFreight[] | null>;
}
