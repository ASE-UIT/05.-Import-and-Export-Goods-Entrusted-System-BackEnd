import { CreateLandFreightDto } from '@/land-freights/dtos/create-land-freights.dto';
import { LandFreight } from '@/land-freights/models/land-freights.model';

export interface ICreateLandFreightStrategy {
  create(landFreightData: CreateLandFreightDto): Promise<LandFreight>;
}