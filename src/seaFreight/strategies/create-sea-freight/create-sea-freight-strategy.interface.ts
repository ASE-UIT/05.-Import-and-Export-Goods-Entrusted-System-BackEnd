import { CreateSeaFreightDto } from '@/seaFreight/dtos/CreateSeaFreightDto';
import { SeaFreight } from '@/seaFreight/models/seaFreight.model';

export interface ICreateSeaFreightStrategy {
  create(seaFreightData: CreateSeaFreightDto): Promise<SeaFreight>;
}