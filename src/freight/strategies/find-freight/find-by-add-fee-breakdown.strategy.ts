import { Injectable } from '@nestjs/common';
import { Freight } from '@/freight/models/freight.model';
import { IFindFreightStrategy } from './find-freight-strategy.interface';

@Injectable()
export class FindFreightByAdditionFeeBreakdownStrategy implements IFindFreightStrategy {
  async find(freightAdditionFeeBreakdown: string): Promise<Freight[] | null> {
    return Freight.findAll({
      where: {additionFeeBreakdown: freightAdditionFeeBreakdown},
    });
  }
}