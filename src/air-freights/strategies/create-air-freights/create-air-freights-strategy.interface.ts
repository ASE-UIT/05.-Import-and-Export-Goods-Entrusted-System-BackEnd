import { CreateAirFreightDto } from '@/air-freights/dtos/create-air-freights.dto';
import { AirFreight } from '@/air-freights/models/air-freights.model';

export interface ICreateAirFreightStrategy {
  create(airFreightData: CreateAirFreightDto): Promise<AirFreight>;
}