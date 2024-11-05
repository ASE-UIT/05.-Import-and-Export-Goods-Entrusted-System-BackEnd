import { Injectable } from '@nestjs/common';
import { Freight } from '@/freights/models/freights.model';
import { IFindFreightStrategy } from './find-freights-strategy.interface';

@Injectable()
export class FindFreightByAdditionFeeStrategy implements IFindFreightStrategy {
  async find(freightAdditionFee: number): Promise<Freight[] | null> {
    return Freight.findAll({
      where: {additionFee: freightAdditionFee},
    });
  }
}