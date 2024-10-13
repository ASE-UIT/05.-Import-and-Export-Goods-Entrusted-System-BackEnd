import { Injectable } from '@nestjs/common';
import { LandFreight } from '@/landFreight/models/landFreight.model';

@Injectable()
export class FindAllLandFreightStrategy {
  async find(): Promise<LandFreight[] | null> {
    return LandFreight.findAll();
  }
}
