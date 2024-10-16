import { CreateAirFreightDto } from '@/airFreight/dtos/CreateAirFreightDto';
import { AirFreight } from '@/airFreight/models/airfreight.model';

export interface IUpdateAirFreightStrategy {
  update(
    airFreightId: string,
    updateInfo: Partial<CreateAirFreightDto>,
  ): Promise<AirFreight>;
}