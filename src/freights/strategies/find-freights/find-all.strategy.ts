import { Injectable} from '@nestjs/common';
import { Freight } from '@/freights/models/freights.model';
import { IFindFreightStrategy } from './find-freights-strategy.interface';

@Injectable()
export class FindAllFreightStrategy implements IFindFreightStrategy{
  async find(): Promise<Freight[] | null> {
    return Freight.findAll();
  }
}
