import { UpdateFreightDto } from '@/freight/dtos/UpdateFreightDto';
import { Freight } from '@/freight/models/freight.model';

export interface IUpdateFreightStrategy {
  update(
    freightId: string,
    updateInfo: UpdateFreightDto,
  ): Promise<Freight>;
}
