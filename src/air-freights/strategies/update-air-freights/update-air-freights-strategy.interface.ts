import { CreateAirFreightDto } from '@/air-freights/dtos/create-air-freights.dto';
import { AirFreight } from '@/air-freights/models/air-freights.model';

export interface IUpdateAirFreightStrategy {
  update(
    airFreightId: string,
    updateInfo: Partial<CreateAirFreightDto>,
  ): Promise<AirFreight>;
}