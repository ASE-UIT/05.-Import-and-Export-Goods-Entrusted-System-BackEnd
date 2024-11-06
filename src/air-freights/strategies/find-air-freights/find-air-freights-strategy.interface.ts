import { AirFreight } from '@/air-freights/models/air-freights.model';

export interface IFindAirFreightStrategy {
  find(airFreightInfo: any): Promise<AirFreight[] | null>;
}
