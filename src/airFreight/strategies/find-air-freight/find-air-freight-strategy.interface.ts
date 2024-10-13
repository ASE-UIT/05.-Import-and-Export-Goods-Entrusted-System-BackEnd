import { AirFreight } from '@/airFreight/models/airFreight.model';

export interface IFindAirFreightStrategy {
  find(airFreightInfo: string | number): Promise<AirFreight[] | null>;
}
