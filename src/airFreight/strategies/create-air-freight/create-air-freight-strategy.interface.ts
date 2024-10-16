import { CreateAirFreightDto } from '@/airFreight/dtos/CreateAirFreightDto';
import { AirFreight } from '@/airFreight/models/airFreight.model';

export interface ICreateAirFreightStrategy {
  create(airFreightData: CreateAirFreightDto): Promise<AirFreight>;
}