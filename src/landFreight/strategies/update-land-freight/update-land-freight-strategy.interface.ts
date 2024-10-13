import { CreateLandFreightDto } from '@/landFreight/dtos/CreateLandFreightDto';
import { LandFreight } from '@/landFreight/models/landfreight.model';

export interface IUpdateLandFreightStrategy {
  update(
    landFreightId: string,
    updateInfo: Partial<CreateLandFreightDto>,
  ): Promise<LandFreight>;
}