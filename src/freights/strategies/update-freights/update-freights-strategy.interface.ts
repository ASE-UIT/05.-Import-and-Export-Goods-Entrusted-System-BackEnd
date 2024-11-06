import { UpdateFreightDto } from '@/freights/dtos/update-freights.dto';
import { Freight } from '@/freights/models/freights.model';

export interface IUpdateFreightStrategy {
  update(
    freightId: string,
    updateInfo: UpdateFreightDto,
  ): Promise<Freight>;
}
