import { Freight } from '@/freights/models/freights.model';

export interface IFindFreightStrategy {
  find(freightInfo: any): Promise<Freight[] | null>;
}
