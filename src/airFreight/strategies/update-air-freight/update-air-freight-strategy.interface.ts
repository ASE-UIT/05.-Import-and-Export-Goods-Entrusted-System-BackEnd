import { CreateAirFreightDto } from '@/airFreight/dtos/CreateAirFreightDto';
import { AirFreight } from '@/airFreight/models/airFreight.model';

export interface IUpdateAirFreightStrategy {
  update(
    airFreightId: string,
    updateInfo: Partial<CreateAirFreightDto>,
  ): Promise<AirFreight>;
}