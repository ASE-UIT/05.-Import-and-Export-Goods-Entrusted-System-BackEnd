import { Injectable} from '@nestjs/common';
import { AirFreight } from '@/air-freights/models/air-freights.model';

@Injectable()
export class FindAllAirFreightStrategy {
  async find(): Promise<AirFreight[] | null> {
    return AirFreight.findAll();
  }
}