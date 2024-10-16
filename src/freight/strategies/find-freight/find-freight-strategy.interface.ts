import { Freight } from '@/freight/models/freight.model';

export interface IFindFreightStrategy {
  find(freightInfo: string | number): Promise<Freight[] | null>;
}
