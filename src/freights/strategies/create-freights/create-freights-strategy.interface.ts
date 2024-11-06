import { CreateFreightDto } from '@/freights/dtos/create-freights.dto';
import { Freight } from '@/freights/models/freights.model';

export interface ICreateFreightStrategy {
  create(freightData: CreateFreightDto): Promise<Freight>;
}
