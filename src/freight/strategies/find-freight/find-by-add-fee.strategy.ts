import { Injectable } from '@nestjs/common';
import { Freight } from '@/freight/models/freight.model';
import { IFindFreightStrategy } from './find-freight-strategy.interface';

@Injectable()
export class FindFreightByAdditionFeeStrategy implements IFindFreightStrategy {
  async find(freightAdditionFee: number): Promise<Freight[] | null> {
    return Freight.findAll({
      where: {additionFee: freightAdditionFee},
    });
  }
}