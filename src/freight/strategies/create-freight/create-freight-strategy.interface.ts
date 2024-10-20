import { CreateFreightDto } from '@/freight/dtos/CreateFreightDto';
import { Freight } from '@/freight/models/freight.model';

export interface ICreateFreightStrategy {
  create(freightData: CreateFreightDto): Promise<Freight>;
}
