import { Freight } from '@/freight/models/freight.model';

export interface IFindFreightStrategy {
  find(freightInfo: any): Promise<Freight[] | null>;
}
