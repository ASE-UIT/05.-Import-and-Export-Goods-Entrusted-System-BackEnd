import { SeaFreight } from '@/seaFreight/models/seaFreight.model';

export interface IFindSeaFreightStrategy {
  find(seaFreightInfo: string | number): Promise<SeaFreight[] | null>;
}
