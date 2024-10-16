import { Injectable} from '@nestjs/common';
import { AirFreight } from '@/airFreight/models/airFreight.model';

@Injectable()
export class FindAllAirFreightStrategy {
  async find(): Promise<AirFreight[] | null> {
    return AirFreight.findAll();
  }
}