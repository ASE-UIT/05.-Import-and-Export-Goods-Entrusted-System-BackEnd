import { Injectable} from '@nestjs/common';
import { Freight } from '@/freight/models/freight.model';

@Injectable()
export class FindAllFreightStrategy {
  async find(): Promise<Freight[] | null> {
    return Freight.findAll();
  }
}
