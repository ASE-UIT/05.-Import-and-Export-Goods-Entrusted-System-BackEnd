import { Injectable} from '@nestjs/common';
import { Freight } from '@/freight/models/freight.model';
import { IFindFreightStrategy } from './find-freight-strategy.interface';

@Injectable()
export class FindAllFreightStrategy implements IFindFreightStrategy{
  async find(): Promise<Freight[] | null> {
    return Freight.findAll();
  }
}
