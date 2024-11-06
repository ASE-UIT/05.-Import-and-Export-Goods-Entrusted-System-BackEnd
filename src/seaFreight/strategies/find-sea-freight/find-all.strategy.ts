import { Injectable} from '@nestjs/common';
import { SeaFreight } from '@/seaFreight/models/seaFreight.model';

@Injectable()
export class FindAllSeaFreightStrategy {
  async find(): Promise<SeaFreight[] | null> {
    return SeaFreight.findAll();
  }
}