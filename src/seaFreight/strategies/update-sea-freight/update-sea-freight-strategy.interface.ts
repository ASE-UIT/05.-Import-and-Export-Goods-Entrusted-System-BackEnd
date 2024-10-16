import { CreateSeaFreightDto } from '@/seaFreight/dtos/CreateSeaFreightDto';
import { SeaFreight } from '@/seaFreight/models/seafreight.model';

export interface IUpdateSeaFreightStrategy {
  update(
    seaFreightId: string,
    updateInfo: Partial<CreateSeaFreightDto>,
  ): Promise<SeaFreight>;
}
