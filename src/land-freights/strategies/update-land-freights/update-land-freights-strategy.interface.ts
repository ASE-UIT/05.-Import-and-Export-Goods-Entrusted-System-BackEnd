import { CreateLandFreightDto } from '@/land-freights/dtos/create-land-freights.dto';
import { LandFreight } from '@/land-freights/models/land-freights.model';

export interface IUpdateLandFreightStrategy {
  update(
    landFreightId: string,
    updateInfo: Partial<CreateLandFreightDto>,
  ): Promise<LandFreight>;
}