import { CreateFreightDto } from '@/freight/dtos/CreateFreightDto';
import { Freight } from '@/freight/models/freight.model';

export interface IUpdateFreightStrategy {
  update(
    freightId: string,
    updateInfo: Partial<CreateFreightDto>,
  ): Promise<Freight>;
}
