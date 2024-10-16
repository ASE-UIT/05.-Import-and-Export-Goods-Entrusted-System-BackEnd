import { CreateLandFreightDto } from '@/landFreight/dtos/CreateLandFreightDto';
import { LandFreight } from '@/landFreight/models/landFreight.model';

export interface ICreateLandFreightStrategy {
  create(landFreightData: CreateLandFreightDto): Promise<LandFreight>;
}