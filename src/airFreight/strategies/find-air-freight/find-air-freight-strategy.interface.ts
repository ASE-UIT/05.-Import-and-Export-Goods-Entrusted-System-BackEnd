import { AirFreight } from '@/airFreight/models/airFreight.model';

export interface IFindAirFreightStrategy {
  find(airFreightInfo: any): Promise<AirFreight[] | null>;
}
