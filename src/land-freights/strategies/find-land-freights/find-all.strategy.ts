import { Injectable } from '@nestjs/common';
import { LandFreight } from '@/land-freights/models/land-freights.model';

@Injectable()
export class FindAllLandFreightStrategy {
  async find(): Promise<LandFreight[] | null> {
    return LandFreight.findAll();
  }
}
